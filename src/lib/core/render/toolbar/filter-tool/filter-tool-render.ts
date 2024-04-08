import {Selection} from "d3";
import {toolRender} from "../tool/tool-render";
import {bindOpenerToDialog, dialogRender} from "../tool/dialog-render";
import {addRawSVGToSelection, elementFromSelection} from "../../../utilities/d3/util";
import filterSVGRaw from "../../../assets/filter.svg";
import {collapsableFieldsetRender} from "../tool/fieldset-render";
import {ToolbarValid} from "../toolbar-render";
import {Series} from "../../series";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";
import {categoryOrderMapToArray} from "../../../data/category";
import {mergeKeys} from "../../../utilities/dom/key";
import {AxisValid} from "../../axis";
import {ScaledValuesCategorical} from "../../../data/scale/scaled-values-categorical";
import {CheckBoxLabel} from "../tool/input-label/checkbox-label";
import {buttonRender} from "../tool/button-render";
import {ParcoordSeries} from "../../../../parcoord";
import {tooltipSimpleRender} from "../tool/tooltip-simple-render";
import {inputLabelsRender, LabelsParentData} from "../tool/input-label/input-labels-render";

export function filterToolRender(toolbarS: Selection<HTMLDivElement>, args: ToolbarValid) {
  const series = args.getSeries()
  const axes = args.getAxes()
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const dialogContainerS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__dialog-container')

  const filterToolS = toolRender(contentS, 'tool--filter')
  const dialogOpenerS = buttonRender(filterToolS, 'toolbar__btn')
  addRawSVGToSelection(dialogOpenerS, filterSVGRaw)
  tooltipSimpleRender(dialogOpenerS, {text: 'Filter'})
  const dialogS = dialogRender(dialogContainerS, 'dialog--side', 'dialog--filter')
  bindOpenerToDialog(dialogOpenerS, dialogS)

  series.forEach(series => {
    seriesControlRender(dialogS, series)
    categoryControlsRender(dialogS, series)
  })
  axes.forEach(axis => axisControlsRender(dialogS, axis))

  return filterToolS
}

function seriesControlRender(menuToolsItemsS: Selection, series: Series) {
  const {key, renderer} = series
  const data = [{
    legend: 'Main Series',
    labelData: [ new CheckBoxLabel({
        label: 'Series', type: 'series',
        dataKey: key, defaultVal: series.keysActive[key] ? true : false,
        onChange: () => {
          renderer.filterDispatch.call('filter', { dataKey: key }, this)
        }
      })
    ]
  }]
  const fieldSetS = collapsableFieldsetRender(menuToolsItemsS, data, 'item', 'item--checkbox-series', 'filter-series')
  inputLabelsRender(fieldSetS)
}

function categoryControlsRender(menuToolsItemsS: Selection, series: Series) {
  const {categories, renderer} = series
  const chartElement = elementFromSelection(renderer.chartS)

  if (!categories) return

  const {title: categoriesTitle, categoryOrderMap: categoryOrderMap, keyOrder} = categories.categories
  const categoryText = getCurrentRespVal(categoriesTitle, {chart: chartElement})

  const options = categoryOrderMapToArray(categoryOrderMap)
  const keys = keyOrder.map(key => mergeKeys([categories.parentKey, key]))

  const data: (LabelsParentData & { legend: string })[] = [{
    legend: categoryText,
    labelData: options.map((option, index) => {
      return new CheckBoxLabel({
        label: option, type: 'category',
        dataKey: keys[index], defaultVal: categories.isKeyActiveByKey(keys[index]),
        onChange: () => {
          renderer.filterDispatch.call('filter', { dataKey: keys[index] }, this)
        }
      })
    })
  }]
  const fieldSetS = collapsableFieldsetRender(menuToolsItemsS, data, 'item', 'item--checkbox-series', 'filter-categories')
  inputLabelsRender(fieldSetS)
}

function axisControlsRender(menuToolsItemsS: Selection, axis: AxisValid) {
  const {renderer} = axis
  const axisScaledValues = axis.scaledValues
  const chartElement = elementFromSelection(renderer.chartS)
  const title = getCurrentRespVal(axis.title, {chart: chartElement})
  const {keys, options} = getAxisCategoryProps(axis)
  let filteredSeries: ParcoordSeries
  if ('key' in axis) {
    keys.push(axis.key)
    options.push('Remove Axis')
    filteredSeries = axis.series.cloneFiltered()
  }
  if (keys.length === 0) return

  const data: (LabelsParentData & { legend: string })[] = [{
    legend: getCurrentRespVal( `${title ?? axisScaledValues.parentKey.toUpperCase()}-Axis`, {chart: chartElement}),
    labelData: options.map((option, index) => {
      const isKeyedAxisOption = 'key' in axis && index === options.length - 1
      const defaultVal = isKeyedAxisOption ? axis.keysActive[keys[index]] : axis.scaledValues.isKeyActiveByKey(keys[index])
      const axisNecessary = (isKeyedAxisOption && filteredSeries?.axes.length <= 2 && defaultVal)
      return new CheckBoxLabel({
        label: option, type: 'category',
        dataKey: keys[index], defaultVal,
        class: axisNecessary ? 'disabled' : undefined,
        onChange: () => {
          renderer.filterDispatch.call('filter', { dataKey: keys[index] }, this)
        }
      })
    })
  }]
  const fieldSetS = collapsableFieldsetRender(menuToolsItemsS, data, 'item', 'item--checkbox-series', `filter-axis-${axisScaledValues.parentKey}`)
  inputLabelsRender(fieldSetS)
}

function getAxisCategoryProps(axis: AxisValid) {
  const axisScaledValues = axis.scaledValues
  return {
    keys: axisScaledValues instanceof ScaledValuesCategorical ?
      axisScaledValues.categories.keyOrder.map(oKey => `${axisScaledValues.parentKey}-${oKey}`) : [],
    options: axisScaledValues instanceof ScaledValuesCategorical ?
      categoryOrderMapToArray(axisScaledValues.categories.categoryOrderMap) : []
  }
}
