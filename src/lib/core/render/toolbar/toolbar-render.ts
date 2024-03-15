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
import {downloadToolRender} from "./download-tool/download-tool-render";

type ToolbarValid = Pick<SeriesChartValid, 'renderer' | 'legend' | 'getSeries' | 'getAxes'>

export function toolbarRender(chartS: Selection, args: ToolbarValid): void {
  const series = args.getSeries()
  const axes = args.getAxes()
  const toolbarS = chartS
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .classed('toolbar', true)

  menuToolsRender(toolbarS)
  const menuToolsItems = toolbarS.selectAll('.menu-tools > .items')
  toolDownloadSVGRender(menuToolsItems, args.renderer)
  series.forEach(series => filterCategoriesRender(menuToolsItems, series))
  axes.forEach(axis => filterAxisRender(menuToolsItems, axis))


  downloadToolRender(toolbarS, args.renderer)
}

function menuToolsRender(selection: Selection<HTMLDivElement>) {
  const menuTools = selection
    .selectAll<HTMLDivElement, any>('.tool.menu-tools')
    .data([null])
    .join('div')
  menuDropdownRender(menuTools)
    .classed('tool menu-tools', true)
    .selectChildren('.chevron').remove()
  menuTools.selectChildren('.text').text('☰')
  return menuTools
}

function filterCategoriesRender(menuToolsItemsS: Selection, series: Series) {
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

function filterAxisRender(menuToolsItemsS: Selection, axis: AxisValid) {
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

  const filterOptions: ToolFilterNominal = { options, keys,
    text: getCurrentRespVal( `${title ?? axisScaledValues.parentKey.toUpperCase()}-Axis`, {chart: chartElement}),
    class: `filter-axis-${axisScaledValues.parentKey}`
  }
  toolFilterNominalRender(menuToolsItemsS, filterOptions)
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
