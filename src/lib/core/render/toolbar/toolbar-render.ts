import {Selection} from "d3";
import {menuDropdownRender} from "../../menu-dropdown";
import {toolDownloadSVGRender} from "./tool-download-svg";
import {AxisValid} from "../axis";
import {ToolFilterNominal, toolFilterNominalRender} from "./tool-filter-nominal";
import {elementFromSelection} from "../../utilities/d3/util";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";
import {categoryOrderMapToArray} from "../../data/category";
import {ScaledValuesCategorical} from "../../data/scale/scaled-values-categorical";
import {mergeKeys} from "../../utilities/dom/key";
import {Series} from "../series";
import {SeriesChartValid} from "../chart/series-chart/series-chart-validation";

type ToolbarValid = SeriesChartValid

export function toolbarRender(chartS: Selection, args: ToolbarValid): void {
  const series = args.getSeries()
  const axes = args.getAxes()
  console.log(series, axes)
  const toolbarS = chartS
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .classed('toolbar', true)
  menuToolsRender(toolbarS)
  const menuToolsItems = toolbarS.selectAll('.menu-tools > .items')
  toolDownloadSVGRender(menuToolsItems)
  series.forEach(series => categorySeriesRender(menuToolsItems, series))
  axes.forEach(axis => categoryAxisRender(menuToolsItems, axis))
}

function menuToolsRender(selection: Selection<HTMLDivElement>) {
  const menuTools = selection
    .selectAll<HTMLDivElement, any>('.menu-tools')
    .data([null])
    .join('div')
  menuDropdownRender(menuTools)
    .classed('menu-tools', true)
    .selectChildren('.chevron').remove()
  menuTools.selectChildren('.text').text('☰')
  return menuTools
}

function categorySeriesRender(menuToolsItemsS: Selection, series: Series) {
  const {renderer, categories, key} = series
  const chartElement = elementFromSelection(renderer.chartSelection)

  toolFilterNominalRender(menuToolsItemsS, {text: 'Main Series', options: ['Series'], keys: [key], class: 'filter-series'})
  if (categories) {
    const {title: categoriesTitle, categoryOrderMap: categoryOrderMap,
      keyOrder} = categories.categories
    const categoryText = getCurrentRespVal(categoriesTitle, {chart: chartElement})
    const filterOptions: ToolFilterNominal = {
      text: categoryText,
      options: categoryOrderMapToArray(categoryOrderMap),
      keys: keyOrder.map(key => mergeKeys([categories.parentKey, key])),
      class: 'filter-category'
    }
    toolFilterNominalRender(menuToolsItemsS, filterOptions)
  }
}

function categoryAxisRender(menuToolsItemsS: Selection, axis: AxisValid) {
  const {renderer} = axis
  const axisScaledValues = axis.scaledValues
  const chartElement = elementFromSelection(renderer.chartSelection)
  const title = getCurrentRespVal(axis.title, {chart: chartElement})
  if(axisScaledValues instanceof ScaledValuesCategorical) {
    const parentKey = axisScaledValues.parentKey
    const filterOptions: ToolFilterNominal = {
      text: getCurrentRespVal( `${title ?? parentKey}-Axis`, {chart: chartElement}),
      options: categoryOrderMapToArray(axisScaledValues.categories.categoryOrderMap),
      keys: axisScaledValues.categories.keyOrder.map(oKey => `${parentKey}-${oKey}`),
      class: `filter-axis-${title}`
    }
    toolFilterNominalRender(menuToolsItemsS, filterOptions)
  }
}
