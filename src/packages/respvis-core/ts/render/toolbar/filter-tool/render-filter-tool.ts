import {Selection} from "d3";
import {renderTool} from "../tool/render/render-tool";
import {bindOpenerToDialog, renderDialog} from "../tool/render/render-dialog";
import {addRawSVGToSelection, elementFromSelection} from "../../../utilities/d3/util";
import filterSVGRaw from "../../../../../../assets/svg/tablericons/filter.svg";
import {FieldSetData, renderFieldset} from "../tool/render/render-fieldset";
import {Toolbar} from "../render-toolbar";
import {Series} from "../../series";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";
import {categoryOrderMapToArray} from "../../../data/categories";
import {mergeKeys} from "../../../utilities/dom/key";
import {Axis} from "../../axis";
import {ScaledValuesCategorical} from "../../../data/scale/scaled-values-categorical";
import {CheckBoxLabel} from "../tool/input-label/checkbox-label";
import {renderButton} from "../tool/render/render-button";
import {renderSimpleTooltip} from "../tool/render/render-simple-tooltip";
import {inputLabelsRender, LabelsParentData} from "../tool/input-label/input-labels-render";
import {InputLabel} from "../tool/input-label/input-label";
import {orderScaledValues, ScaledValuesLinearScale} from "../../../data/scale/scaled-values-base";
import {RangeLabel} from "../tool/input-label/range-label";

export function renderFilterTool(toolbarS: Selection<HTMLDivElement>, args: Toolbar) {
  const seriesCollection = args.getSeries()
  const axes = args.getAxes()
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const dialogContainerS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__dialog-container')

  const filterToolS = renderTool(contentS, 'tool--filter')
  const dialogOpenerS = renderButton(filterToolS, 'toolbar__btn')
  addRawSVGToSelection(dialogOpenerS, filterSVGRaw)
  renderSimpleTooltip(dialogOpenerS, {text: 'Filter'})
  const dialogS = renderDialog(dialogContainerS, 'dialog--side', 'dialog--filter')
  bindOpenerToDialog({dialogOpenerS, dialogS, transitionMS: 300})

  seriesCollection.forEach(series => {
    if (seriesCollection.length > 1) renderSeriesControl(dialogS, series)
    renderCategoryControls(dialogS, series)
  })
  const axesOrdered = orderScaledValues(axes.map(axis => axis.scaledValues), axes);
  [...axesOrdered.linear, ...axesOrdered.date].forEach(axisOrdered => renderAxisLinearControls(dialogS, axisOrdered.wrapper, axisOrdered.values))
  axesOrdered.categorical.forEach(axis => renderAxisControls(dialogS, axis.wrapper))

  return filterToolS
}

function renderSeriesControl(menuToolsItemsS: Selection, series: Series) {
  const {key, renderer} = series
  const onClick = (e) => {
    if (renderer.exitEnterActive()) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
  const data: (LabelsParentData & FieldSetData)[] = [{
    legend: 'Main Series',
    collapsable: true,
    labelData: [new CheckBoxLabel({
      label: 'Series', type: 'series',
      dataKey: key, defaultVal: series.keysActive[key] ? true : false,
      onClick,
      onChange: () => {
        renderer.filterDispatch.call('filter', {dataKey: key}, this)
      }
    })
    ]
  }]
  const fieldSetS = renderFieldset(menuToolsItemsS, data, 'item', 'item--checkbox-series', 'filter-series')
  inputLabelsRender(fieldSetS)
}

function renderAxisLinearControls(menuToolsItemsS: Selection, axis: Axis, values: ScaledValuesLinearScale) {
  const {renderer} = axis
  const chartElement = elementFromSelection(renderer.chartS)
  const title = getCurrentRespVal(axis.title, {chart: chartElement})
  const domain: number[] = values.scale.domain().map(d => d.valueOf())
  const [min, max] = [Math.min(...domain), Math.max(...domain)]
  const [minMin, minMax] = [min, values.filteredRanges[0][1].valueOf()]
  const [maxMin, maxMax] = [values.filteredRanges[0][0].valueOf(), max]
  const onNumberInput = (e: InputEvent, labelD: RangeLabel) => {
    const type = labelD.data.type
    const index = type.charAt(type.length - 1)
    const valueString = (e.target as HTMLInputElement).value
    const valueNumber = parseFloat(valueString)
    // console.log(valueNumber)
    if (isNaN(valueNumber)) return
    if (values.tag === 'linear') values.filteredRanges[0][index] = valueNumber
    else {
      values.filteredRanges[0][index] = new Date(Math.floor(valueNumber))
    }
    renderer.windowS.dispatch('resize')
  }

  const data: (LabelsParentData & FieldSetData)[] = [{
    legend: title,
    collapsable: true,
    labelData: values.filteredRanges.map((range) => {
      const axisFormatFunction = axis.d3Axis?.tickFormat() ?? values.scale.tickFormat()
      return [
        new RangeLabel({
          label: 'Min: ' + axisFormatFunction(range[0], 0),
          type: `$range-0-0`,
          value: values.filteredRanges[0][0].valueOf().toString(),
          min: minMin, max: minMax,
          step: 1,
          onInput: onNumberInput,
        }),
        new RangeLabel({
          label: 'Max: ' + axisFormatFunction(range[1], 0),
          type: `$range-0-1`,
          value: values.filteredRanges[0][1].valueOf().toString(),
          min: maxMin, max: maxMax,
          step: 1,
          onInput: onNumberInput,
        })
      ]
    }).flat()
  }]
  const fieldSetS = renderFieldset(menuToolsItemsS, data, 'item', 'item--range-filter', `filter-axis-${values.parentKey}`)
  inputLabelsRender(fieldSetS)
}

function renderCategoryControls(menuToolsItemsS: Selection, series: Series) {
  const {categories, renderer} = series
  const chartElement = elementFromSelection(renderer.chartS)

  if (!categories) return

  const {title: categoriesTitle, categoryOrderMap: categoryOrderMap, keyOrder} = categories.categories
  const categoryText = getCurrentRespVal(categoriesTitle, {chart: chartElement})

  const options = categoryOrderMapToArray(categoryOrderMap)
  const keys = keyOrder.map(key => mergeKeys([categories.parentKey, key]))

  const onClick = (e) => {
    if (renderer.exitEnterActive()) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const data: (LabelsParentData & FieldSetData)[] = [{
    legend: categoryText,
    collapsable: true,
    labelData: options.map((option, index) => {
      return new CheckBoxLabel({
        label: option, type: 'category',
        dataKey: keys[index], defaultVal: categories.isKeyActiveByKey(keys[index]),
        onClick,
        onChange: () => {
          if (renderer.exitEnterActive()) return
          renderer.filterDispatch.call('filter', {dataKey: keys[index]}, this)
        }
      })
    })
  }]
  const fieldSetS = renderFieldset(menuToolsItemsS, data, 'item', 'item--checkbox-series', 'filter-categories')
  inputLabelsRender(fieldSetS)
}

function renderAxisControls(menuToolsItemsS: Selection, axis: Axis) {
  const {renderer} = axis
  const axisScaledValues = axis.scaledValues
  const chartElement = elementFromSelection(renderer.chartS)
  const title = getCurrentRespVal(axis.title, {chart: chartElement})
  const {keys, options} = getAxisCategoryProps(axis)

  const onClick = (e) => {
    if (renderer.exitEnterActive()) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const labelData: InputLabel[] = options.map((option, index) => {
    return new CheckBoxLabel({
      label: option, type: 'category',
      dataKey: keys[index], defaultVal: axis.scaledValues.isKeyActiveByKey(keys[index]),
      onClick,
      onChange: () => {
        if (renderer.exitEnterActive()) return
        renderer.filterDispatch.call('filter', {dataKey: keys[index]}, this)
      }
    })
  })

  if (keys.length === 0 && !('key' in axis)) return
  let removeAxisLabel: CheckBoxLabel | undefined
  if ('key' in axis) {
    const defaultVal = axis.keysActive[axis.key]
    const axisNecessary = (axis.series.cloneFiltered()?.axes.length <= 2 && defaultVal)
    removeAxisLabel = new CheckBoxLabel({
      activeClasses: axisNecessary ? ['disabled'] : undefined,
      inactiveClasses: !axisNecessary ? ['disabled'] : undefined,
      label: '', type: 'category',
      dataKey: axis.key, defaultVal,
      onChange: () => {
        renderer.filterDispatch.call('filter', {dataKey: axis.key}, this)
      }
    })
  }

  const data: (LabelsParentData & FieldSetData)[] = [{
    legend: getCurrentRespVal(`${title ?? axisScaledValues.parentKey.toUpperCase()}-Axis`, {chart: chartElement}),
    collapsable: (!('key' in axis) || keys.length > 1),
    filterable: removeAxisLabel,
    labelData
  }]

  const fieldSetS = renderFieldset(menuToolsItemsS, data, 'item', 'item--checkbox-series', `filter-axis-${axisScaledValues.parentKey}`)
  inputLabelsRender(fieldSetS)
}

function getAxisCategoryProps(axis: Axis) {
  const axisScaledValues = axis.scaledValues
  return {
    keys: axisScaledValues instanceof ScaledValuesCategorical ?
      axisScaledValues.categories.keyOrder.map(oKey => `${axisScaledValues.parentKey}-${oKey}`) : [],
    options: axisScaledValues instanceof ScaledValuesCategorical ?
      categoryOrderMapToArray(axisScaledValues.categories.categoryOrderMap) : []
  }
}
