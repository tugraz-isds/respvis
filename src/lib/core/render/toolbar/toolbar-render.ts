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
import {isScaledValuesCategorical} from "../../data/scale/scaled-values";

type ToolbarValid = RenderArgs & {
  x: AxisValid,
  y: AxisValid,
  legend: LegendValid
}

export function toolbarRender<D extends ToolbarValid>(selection: Selection<HTMLDivElement, D>): void {
  const {renderer, legend} = selection.datum()
  const {categories,
    x, y, key} = legend.series
  const toolbarS = selection
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .classed('toolbar', true)

  menuToolsRender(toolbarS)
  const menuToolsItems = toolbarS.selectAll('.menu-tools > .items')
  toolDownloadSVGRender(menuToolsItems)

  const chartElement = elementFromSelection(renderer.chartSelection)
  //categories
  if (categories) {
    const {title: categoriesTitle, orderMap: categoryOrderMap,
      orderKeys} = categories
    const filterOptions: ToolFilterNominal = {
      text: getCurrentRespVal(categoriesTitle, {chart: chartElement}),
      options: categoryOrderMapToArray(categoryOrderMap),
      keys: orderKeys.map(oKey => key + ' ' + oKey)
    }
    toolFilterNominalRender(menuToolsItems, filterOptions)
  }

  // catgorical x axis
  if(isScaledValuesCategorical(x)) {
    // console.log(x.scale)
    const filterOptions: ToolFilterNominal = {
      text: getCurrentRespVal('X-Axis Categories', {chart: chartElement}),
      options: categoryOrderMapToArray(x.categories.orderMap),
      keys: x.categories.orderKeys.map(oKey => `${x.parentKey}-${oKey}`)
    }
    toolFilterNominalRender(menuToolsItems, filterOptions)
  }
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
