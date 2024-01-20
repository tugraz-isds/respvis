import {Selection} from "d3";
import {menuDropdownRender} from "../../menu-dropdown";
import {toolDownloadSVGRender} from "./tool-download-svg";
import {AxisValid} from "../axis";
import {ToolFilterNominal, toolFilterNominalRender} from "./tool-filter-nominal";
import {RenderArgs} from "../charts/renderer";
import {elementFromSelection} from "../../utilities/d3/util";
import {LegendValid} from "../legend";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";

type ToolbarValid = RenderArgs & {
  x: AxisValid,
  y: AxisValid,
  legend: LegendValid
}

export function toolbarRender<D extends ToolbarValid>(selection: Selection<HTMLDivElement, D>): void {
  const {x, renderer, legend} = selection.datum()
  const toolbarS = selection
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .classed('toolbar', true)

  menuToolsRender(toolbarS)
  const menuToolsItems = toolbarS.selectAll('.menu-tools > .items')
  toolDownloadSVGRender(menuToolsItems)

  const chartElement = elementFromSelection(renderer.chartSelection)
  const filterOptions: ToolFilterNominal = {
    text: getCurrentRespVal(x.categoriesTitle, {chart: chartElement}),
    options: Object.keys(x.categoryOrder),
    keys: legend.keys
  }

  toolFilterNominalRender(menuToolsItems, filterOptions)
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
