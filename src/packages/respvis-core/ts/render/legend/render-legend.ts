import {select, Selection} from "d3";
import {elementFromSelection} from "../../utilities/d3/util";
import {SVGHTMLElement} from "../../constants/types";
import {Legend} from "./validate-legend";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";
import {renderLegendItems} from "./legend-item/render-legend-items";

export type LegendSelection = Selection<SVGHTMLElement, Legend>

export function renderLegend(parentS: Selection, legend: Legend): LegendSelection {
  const legendS = parentS
    .selectAll<SVGGElement, Legend>('.legend')
    .data([legend])
    .join('g')
    .classed('legend', true)
  legend.renderer.legendS = legendS

  legendS.each((legendD, i, g) => {
    const legendS = select<SVGHTMLElement, Legend>(g[i])
    renderTitle(legendS)
    renderLegendItems(legendS)
  })

  return legendS
}

function renderTitle(selection: LegendSelection) {
  const legendD = selection.datum()
  const chartElement = elementFromSelection(legendD.renderer.chartS)
  const legendElement = elementFromSelection(selection) as SVGGElement
  selection
    .selectAll('.title')
    .data([null])
    .join('text')
    .classed('title', true)
    .text(getCurrentRespVal(legendD.title, {chart: chartElement, self: legendElement}))
}
