import {select, Selection} from "d3";
import {elementFromSelection, throttle} from "../../utilities/d3/util";
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
    renderCrossToolState(legendS)
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

function renderCrossToolState(selection: LegendSelection) {
  const { renderer, series } = selection.datum()
  const active = renderer.windowS.datum().windowSettings.movableCrossActive
  const flipped = series.responsiveState.flipped

  const crossStateTextS = selection
    .selectAll('.cross-state')
    .data(active ? [null] : [])
    .join('g')
    .classed('cross-state', true)
    .selectAll('text')
    .data(active ? [null, null] : [])
    .join('text')

  renderer.drawAreaS.classed('cursor-cross', active)

  const onMouseMove = (e) => {
    const backgroundE = elementFromSelection(renderer.drawAreaBgS) as Element
    const rect = backgroundE.getBoundingClientRect()
    const x = flipped ? e.clientY - rect.top : e.clientX - rect.left
    const y = flipped ? e.clientX - rect.left : e.clientY - rect.top

    const scaledVals = series.getScaledValuesAtScreenPosition(x, y)
    const firstText = crossStateTextS.filter(function(d, i) { return i === 0; })
    const secondText = crossStateTextS.filter(function(d, i) { return i === 1; })

    firstText.text(scaledVals.x ? "X: " + scaledVals.x : firstText.text())
    secondText.text(scaledVals.y ? "Y: " + scaledVals.y : secondText.text())
  }

  const throttleObj = throttle(onMouseMove, 50)
  renderer.drawAreaS
    .on('mousemove.crossInfo', active ? (e) => throttleObj.func(e) : null as any)
}
