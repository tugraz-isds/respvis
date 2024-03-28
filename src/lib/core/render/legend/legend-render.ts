import {select, Selection} from "d3";
import {elementFromSelection, throttle} from "../../utilities/d3/util";
import {SVGHTMLElement} from "../../constants/types";
import {LegendValid} from "./legend-validation";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";
import {legendItemsRender} from "./legend-items-render";

export type LegendSelection = Selection<SVGHTMLElement, LegendValid>

export function legendRender(parentS: Selection, data: LegendValid): LegendSelection {
  const legendS = parentS
    .selectAll<SVGGElement, LegendValid>('.legend')
    .data([data])
    .join('g')
    .classed('legend', true)
  data.renderer.legendSelection = legendS

  legendS.each((legendD, i, g) => {
    const legendS = select<SVGHTMLElement, LegendValid>(g[i])
    legendTitleRender(legendS)
    legendItemsRender(legendS)
    legendCrossStateRender(legendS)
  })

  return legendS
}

function legendTitleRender(selection: LegendSelection) {
  const legendD = selection.datum()
  const chartElement = elementFromSelection(legendD.renderer.chartSelection)
  const legendElement = elementFromSelection(selection)
  selection
    .selectAll('.title')
    .data([null])
    .join('text')
    .classed('title', true)
    .text(getCurrentRespVal(legendD.title, {chart: chartElement, self: legendElement}))
}

function legendCrossStateRender(selection: LegendSelection) {
  const { renderer, series } = selection.datum()
  const active = renderer.windowSelection.datum().windowSettings.movableCrossActive
  const drawAreaS = renderer.drawAreaSelection
  const backgroundS = drawAreaS?.selectChild('.background')
  const flipped = series.responsiveState.flipped

  const crossStateTextS = selection
    .selectAll('.cross-state')
    .data(active ? [null] : [])
    .join('g')
    .classed('cross-state', true)
    .selectAll('text')
    .data(active ? [null, null] : [])
    .join('text')

  drawAreaS?.classed('cursor-cross', active)

  const onMouseMove = (e) => {
    const backgroundE = elementFromSelection(backgroundS) as Element
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
  drawAreaS?.on('mousemove.crossInfo', active ? (e) => throttleObj.func(e) : null as any)
}
