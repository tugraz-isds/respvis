import {select, Selection} from "d3";
import {positionTooltipAuto, setTooltipVisibility, tooltipSelector} from "./tooltip";
import {Window} from "respvis-core";

export function renderTooltip(): Selection<HTMLDivElement> {
  const bodyS = select('html > body')
  const windowS = bodyS.selectAll<HTMLDivElement, Window>('.window-rv')
  const drawAreaS = windowS.selectAll<HTMLDivElement, Window>('.draw-area')
  const tooltipS = bodyS.selectAll<HTMLDivElement, unknown>(tooltipSelector)
    .data([null])
    .join('div')
    .attr('id', 'tooltip-rv')
  drawAreaS.on('pointermove.tooltipVisibility', function(e) {
    const window = windowS.data().find(window => window.tooltip.numberOfVisibleTools() > 0)
    setTooltipVisibility(!!window ? 'visible' : 'hidden')
    const tooltipS = select<HTMLDivElement, any>(tooltipSelector)
    const mousePosition = { x: e.clientX, y: e.clientY }
    positionTooltipAuto(tooltipS, {position: mousePosition, offset: window?.tooltip.autoOffset})
  }).on('pointerout.tooltipVisibility', function(e) {
    setTooltipVisibility('hidden')
  })
  return tooltipS
}
