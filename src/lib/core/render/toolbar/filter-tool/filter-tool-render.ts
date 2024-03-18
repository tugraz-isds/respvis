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
import {checkboxLabelsRender} from "../tool/checkbox-labels-render";
import {buttonRender} from "../tool/button-render";

export function filterToolRender(selection: Selection<HTMLDivElement>, args: ToolbarValid) {
  const series = args.getSeries()
  const axes = args.getAxes()

  const filterToolS = toolRender(selection, 'tool--filter')
  const dialogOpenerS = buttonRender(filterToolS, 'toolbar__btn')
  addRawSVGToSelection(dialogOpenerS, filterSVGRaw)
  const dialogS = dialogRender(filterToolS, 'dialog--filter')
  bindOpenerToDialog(dialogOpenerS, dialogS)

  axes.forEach(axis => axisControlsRender(dialogS, axis))
  series.forEach(series => {
    seriesControlRender(dialogS, series)
    categoryControlsRender(dialogS, series)
  })

  return filterToolS
}

function seriesControlRender(menuToolsItemsS: Selection, series: Series) {
  const {key} = series
  const data = [{
    legend: 'Main Series',
    labelData: [
      { label: 'Series', type: 'series', dataKey: key, defaultVal: true }
    ]
  }]
  const fieldSetS = collapsableFieldsetRender(menuToolsItemsS, data, 'item', 'item--checkbox-series', 'filter-series')
  checkboxLabelsRender(fieldSetS)
}

function categoryControlsRender(menuToolsItemsS: Selection, series: Series) {
  const {categories, renderer} = series
  const chartElement = elementFromSelection(renderer.chartSelection)

  if (!categories) return

  const {title: categoriesTitle, categoryOrderMap: categoryOrderMap, keyOrder} = categories.categories
  const categoryText = getCurrentRespVal(categoriesTitle, {chart: chartElement})

  const options = categoryOrderMapToArray(categoryOrderMap)
  const keys = keyOrder.map(key => mergeKeys([categories.parentKey, key]))

  const data = [{
    legend: categoryText,
    labelData: options.map((option, index) => {
      return { label: option, type: 'category', dataKey: keys[index], defaultVal: true }
    })
  }]
  const fieldSetS = collapsableFieldsetRender(menuToolsItemsS, data, 'item', 'item--checkbox-series', 'filter-categories')
  checkboxLabelsRender(fieldSetS)
}

function axisControlsRender(menuToolsItemsS: Selection, axis: AxisValid) {
  const {renderer} = axis
  const axisScaledValues = axis.scaledValues
  const chartElement = elementFromSelection(renderer.chartSelection)
  const title = getCurrentRespVal(axis.title, {chart: chartElement})
  const {keys, options} = getAxisCategoryProps(axis)
  if ('key' in axis) {
    keys.push(axis.key)
    options.push('Remove Axis')
  }
  if (keys.length === 0) return

  const data = [{
    legend: getCurrentRespVal( `${title ?? axisScaledValues.parentKey.toUpperCase()}-Axis`, {chart: chartElement}),
    labelData: options.map((option, index) => {
      return { label: option, type: 'category', dataKey: keys[index], defaultVal: true }
    })
  }]
  const fieldSetS = collapsableFieldsetRender(menuToolsItemsS, data, 'item', 'item--checkbox-series', `filter-axis-${axisScaledValues.parentKey}`)
  checkboxLabelsRender(fieldSetS)
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
