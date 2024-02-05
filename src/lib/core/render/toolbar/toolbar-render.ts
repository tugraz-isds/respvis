import {Selection} from "d3";
import {menuDropdownRender} from "../../menu-dropdown";
import {toolDownloadSVGRender} from "./tool-download-svg";
import {AxisValid} from "../axis";
import {ToolFilterNominal, toolFilterNominalRender} from "./tool-filter-nominal";
import {RenderArgs} from "../charts/renderer";
import {elementFromSelection} from "../../utilities/d3/util";
import {LegendValid} from "../legend";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";
import {categoryOrderMapToArray} from "../../data/category";
import {ScaledValuesCategorical} from "../../data/scale/scaled-values-categorical";
import {mergeKeys} from "../../utilities/dom/key";

type ToolbarValid = RenderArgs & {
  x: AxisValid,
  y: AxisValid,
  legend: LegendValid
}

export function toolbarRender<D extends ToolbarValid>(selection: Selection<HTMLDivElement, D>): void {
  const toolbarS = selection
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .classed('toolbar', true)
  menuToolsRender(toolbarS)
  const menuToolsItems = toolbarS.selectAll('.menu-tools > .items')
  toolDownloadSVGRender(menuToolsItems)
  categorySeriesRender(menuToolsItems, selection.datum())
  categoryAxisRender(menuToolsItems, selection.datum(), 'x')
  categoryAxisRender(menuToolsItems, selection.datum(), 'y')
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

function categorySeriesRender(menuToolsItemsS: Selection, toolbarValid: ToolbarValid) {
  const {renderer, legend} = toolbarValid
  const {categories, key} = legend.series
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

function categoryAxisRender(menuToolsItemsS: Selection, toolbarValid: ToolbarValid, axis: 'x' | 'y') {
  const {renderer} = toolbarValid
  const axisScaledValues = toolbarValid[axis].scaledValues
  const chartElement = elementFromSelection(renderer.chartSelection)
  if(axisScaledValues instanceof ScaledValuesCategorical) {
    const filterOptions: ToolFilterNominal = {
      text: getCurrentRespVal( `${axis.toUpperCase()}-Axis Categories`, {chart: chartElement}),
      options: categoryOrderMapToArray(axisScaledValues.categories.categoryOrderMap),
      keys: axisScaledValues.categories.keyOrder.map(oKey => `${axisScaledValues.parentKey}-${oKey}`),
      class: `filter-axis-${axis}`
    }
    toolFilterNominalRender(menuToolsItemsS, filterOptions)
  }
}
