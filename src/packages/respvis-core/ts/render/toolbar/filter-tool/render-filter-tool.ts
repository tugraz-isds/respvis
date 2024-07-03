import {select, Selection} from "d3";
import {renderTool} from "../tool/render/render-tool";
import {bindOpenerToDialog, renderDialog} from "../tool/render/render-dialog";
import {addRawSVGToSelection} from "../../../utilities/d3/util";
import filterSVGRaw from "../../../../../../assets/svg/tablericons/filter.svg";
import {FieldSetData, renderFieldset} from "../tool/render/render-fieldset";
import {Toolbar} from "../render-toolbar";
import {Series} from "../../series";
import {mergeKeys} from "../../../utilities/dom/key";
import {Axis} from "../../axis";
import {ScaledValuesCategorical} from "../../../data/scale/scaled-values-spatial/scaled-values-categorical";
import {CheckBoxLabel} from "../tool/input-label/checkbox-label";
import {renderButton} from "../tool/render/render-button";
import {renderSimpleTooltip} from "../tool/render/render-simple-tooltip";
import {LabelsParentData, renderInputLabels} from "../tool/input-label/render-input-labels";
import {InputLabel} from "../tool/input-label/input-label";
import {RangeLabel} from "../tool/input-label/range-label";
import type {KeyedAxis} from "../../../../../respvis-parcoord/ts/render";
import {getCurrentResponsiveValue, orderScaledValuesSpatial, ScaledValuesSpatialNumericOrTemporal} from "../../../data";

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
  const axesOrdered = orderScaledValuesSpatial(axes.map(axis => axis.scaledValues), axes);
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
  renderInputLabels(fieldSetS)
}

//TODO: Refactor Double Input Range in own file
function renderAxisLinearControls(menuToolsItemsS: Selection, axis: Axis, values: ScaledValuesSpatialNumericOrTemporal) {
  const {renderer} = axis
  const title = getCurrentResponsiveValue(axis.title, {chart: renderer.chartS})
  const domain: number[] = values.scale.domain().map(d => d.valueOf())
  const [minFilter, maxFilter] = [values.filteredRanges[0][0].valueOf(), values.filteredRanges[0][1].valueOf()]
  const [minDomain, maxDomain] = [Math.min(...domain), Math.max(...domain)]

  const onNumberInput = (e: InputEvent, labelD: RangeLabel) => {
    const target = e.target as HTMLInputElement
    const doubleRangeSliderS = select(target?.closest('.double-range-slider'))
    const inputMin = doubleRangeSliderS.selectAll('.min-range input')
    const inputMax = doubleRangeSliderS.selectAll('.max-range input')
    const type = labelD.data.type
    const index = type.charAt(type.length - 1)
    const valueString = (e.target as HTMLInputElement).value
    const valueNumber = parseFloat(valueString)

    if (isNaN(valueNumber)) return
    const dragMinOverMax = (type === `$range-0-0` && valueNumber >= maxFilter)
    const dragMaxBelowMin = (type === `$range-0-1` && valueNumber <= minFilter)
    const valueResult = dragMinOverMax ? maxFilter :
      dragMaxBelowMin ? minFilter : valueNumber
    if (values.tag === 'linear') values.filteredRanges[0][index] = valueResult
    else values.filteredRanges[0][index] = new Date(Math.floor(valueResult))
    if (dragMinOverMax || dragMaxBelowMin) {
      target.value = valueResult.toString()
    }
    inputMin.classed('dominant', labelD.data.type === `$range-0-0`)
    inputMax.classed('dominant', labelD.data.type === `$range-0-1`)
    renderer.windowS.dispatch('resize')
  }

  const data: (LabelsParentData & FieldSetData)[] = [{
    legend: title,
    collapsable: true,
    filterable: 'key' in axis ? createKeyedAxisCheckboxLabel(axis) : undefined,
    labelData: values.filteredRanges.map((range) => {
      const axisFormatFunction = axis.d3Axis?.tickFormat() ?? values.scale.tickFormat()
      return [
        new RangeLabel({
          label: 'Min: ' + axisFormatFunction(range[0], 0),
          type: `$range-0-0`,
          value: values.filteredRanges[0][0].valueOf().toString(),
          min: minDomain, max: maxDomain,
          step: 1,
          activeClasses: ['min-range'],
          onInput: onNumberInput,
        }),
        new RangeLabel({
          label: 'Max: ' + axisFormatFunction(range[1], 0),
          type: `$range-0-1`,
          value: values.filteredRanges[0][1].valueOf().toString(),
          min: minDomain, max: maxDomain,
          activeClasses: ['max-range'],
          step: 1,
          onInput: onNumberInput,
        })
      ]
    }).flat()
  }]
  const fieldSetS = renderFieldset(menuToolsItemsS, data, 'item', 'item--double-range-filter', `filter-axis-${values.parentKey}`)
  const doubleRangeSliderS = fieldSetS.selectAll('.double-range-slider')
    .data((d) => [d]).join('div')
    .classed('double-range-slider', true)
    .style('--range-start', (minFilter / maxDomain) + '')
    .style('--range-end', (maxFilter / maxDomain) + '')

  doubleRangeSliderS.selectAll('.double-range-slider__track')
    .data([null]).join('div')
    .classed('double-range-slider__track', true)
  doubleRangeSliderS.selectAll('.double-range-slider__range')
    .data([null]).join('div')
    .classed('double-range-slider__range', true)
  renderInputLabels(doubleRangeSliderS)
  doubleRangeSliderS.selectAll('input').classed('double-range-slider__input', true)
}

function renderCategoryControls(menuToolsItemsS: Selection, series: Series) {
  const {categories, renderer} = series
  if (!categories) return

  const {title: categoriesTitle} = categories.categories
  const categoryText = getCurrentResponsiveValue(categoriesTitle, {chart: renderer.chartS})
  const categoryArray = categories.categories.categoryArray

  const onClick = (e) => {
    if (renderer.exitEnterActive()) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const data: (LabelsParentData & FieldSetData)[] = [{
    legend: categoryText,
    collapsable: true,
    labelData: categoryArray.map((option) => {
      return new CheckBoxLabel({
        label: option.value, type: 'category',
        dataKey: mergeKeys([categories.parentKey, option.key]),
        defaultVal: categories.isKeyActiveByKey(option.key),
        onClick,
        onChange: () => {
          if (renderer.exitEnterActive()) return
          renderer.filterDispatch.call('filter', {dataKey: option.key}, this)
        }
      })
    })
  }]
  const fieldSetS = renderFieldset(menuToolsItemsS, data, 'item', 'item--checkbox-series', 'filter-categories')
  renderInputLabels(fieldSetS)
}

function renderAxisControls(menuToolsItemsS: Selection, axis: Axis) {
  const {renderer} = axis
  const axisScaledValues = axis.scaledValues
  const title = getCurrentResponsiveValue(axis.title, {chart: renderer.chartS})
  const {keys, options} = getAxisCategoryProps(axis)

  const onClick = (e) => {
    if (renderer.exitEnterActive()) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const labelData: InputLabel[] = options.map((option, index) => {
    return new CheckBoxLabel({
      label: option.value, type: 'category',
      dataKey: keys[index], defaultVal: axis.scaledValues.isKeyActiveByKey(keys[index]),
      onClick,
      onChange: () => {
        if (renderer.exitEnterActive()) return
        renderer.filterDispatch.call('filter', {dataKey: keys[index]}, this)
      }
    })
  })

  if (keys.length === 0 && !('key' in axis)) return

  const data: (LabelsParentData & FieldSetData)[] = [{
    legend: getCurrentResponsiveValue(`${title ?? axisScaledValues.parentKey.toUpperCase()}`, {chart: renderer.chartS}),
    collapsable: (!('key' in axis) || keys.length > 1),
    filterable: 'key' in axis ? createKeyedAxisCheckboxLabel(axis) : undefined,
    labelData
  }]

  const fieldSetS = renderFieldset(menuToolsItemsS, data, 'item', 'item--checkbox-series', `filter-axis-${axisScaledValues.parentKey}`)
  renderInputLabels(fieldSetS)
}

function getAxisCategoryProps(axis: Axis) {
  const axisScaledValues = axis.scaledValues
  return {
    keys: axisScaledValues instanceof ScaledValuesCategorical ?
      axisScaledValues.categories.categoryArray.map(c => `${axisScaledValues.parentKey}-${c.key}`) : [],
    options: axisScaledValues instanceof ScaledValuesCategorical ?
      axisScaledValues.categories.categoryArray : []
  }
}

function createKeyedAxisCheckboxLabel(axis: KeyedAxis) {
  const defaultVal = axis.keysActive[axis.key]
  const axisNecessary = (axis.series.cloneFiltered()?.axes.length <= 2 && defaultVal)
  return new CheckBoxLabel({
    activeClasses: axisNecessary ? ['disabled'] : undefined,
    inactiveClasses: !axisNecessary ? ['disabled'] : undefined,
    label: '', type: 'category',
    dataKey: axis.key, defaultVal,
    onChange: () => {
      axis.series.renderer.filterDispatch.call('filter', {dataKey: axis.key}, this)
    }
  })
}
