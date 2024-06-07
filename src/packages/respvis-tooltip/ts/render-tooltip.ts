import {select, Selection} from "d3";
import {positionTooltipAuto, setTooltipVisibility, tooltipSelector} from "./tooltip";
import {Window} from "respvis-core";

export function renderTooltip(): Selection<HTMLDivElement> {
  const bodyS = select('html > body')
  const windowS = bodyS.selectAll<HTMLDivElement, Window>('.window-rv')
  const tooltipS = bodyS.selectAll<HTMLDivElement, unknown>(tooltipSelector)
    .data([null])
    .join('div')
    .attr('id', 'tooltip-rv')
  windowS.on('pointermove.tooltipVisibility', function(e) {
    const window = windowS.data().find(window => window.tooltip.visible())
    setTooltipVisibility(!!window ? 'visible' : 'hidden')
    const tooltipS = select<HTMLDivElement, any>(tooltipSelector)
    const mousePosition = { x: e.clientX, y: e.clientY }
    positionTooltipAuto(tooltipS, {position: mousePosition, offset: window?.tooltip.autoOffset})
  })
  return tooltipS
}
