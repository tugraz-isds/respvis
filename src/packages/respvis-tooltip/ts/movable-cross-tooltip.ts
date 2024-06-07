import {elementFromSelection, Series, throttle} from "respvis-core";
import {select} from "d3";
import {tooltipSelector} from "./tooltip";

export function renderMovableCrossTooltip(series: Series) {
  const { renderer} = series
  const tooltip = renderer.windowS.datum().tooltip
  const active = renderer.windowS.datum().windowSettings.movableCrossActive && tooltip.active
  const tooltipS = select(tooltipSelector)
  const flipped = series.responsiveState.currentlyFlipped

  const crossStateTextS = tooltipS
    .selectAll('.tooltip--cross-state')
    .data(active ? [null] : [])
    .join('g')
    .classed('tooltip--cross-state', true)
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
    .on('pointerover.tooltipMovableCross', () => {
      tooltip.movableCrossTooltipVisible = renderer.windowS.datum().windowSettings.movableCrossActive
    })
    .on('pointerout.tooltipMovableCross', () => tooltip.movableCrossTooltipVisible = false)
}
