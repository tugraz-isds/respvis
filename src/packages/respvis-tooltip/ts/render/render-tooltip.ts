import {elementFromSelection, Window} from "respvis-core";
import {select, Selection} from "d3";
import {setTooltipVisibility, tooltipSelector} from "./tooltip";

export function renderTooltip(): Selection<HTMLDivElement> {
  const bodyS = select('html > body')
  const windowS = bodyS.selectAll<HTMLDivElement, Window>('.window-rv')
  const drawAreaS = windowS.selectAll<HTMLDivElement, Window>('.draw-area')

  const tooltipS = bodyS.selectAll<HTMLDivElement, unknown>(tooltipSelector)
    .data([null])
    .join('div')
    .attr('id', 'tooltip-rv')

  drawAreaS.on('pointermove.tooltipVisibility', function() {
    const windowRV = windowS.data().find(windowRV => windowRV?.tooltip.isVisible())
    setTooltipVisibility(!!windowRV ? 'visible' : 'hidden')
  }).on('pointerout.tooltipVisibility', function() {
    setTooltipVisibility('hidden')
  })

  select(window).on('pointermove.tooltipVisibility', function(e) {
    const windowHovered = windowS.data().find(windowRV => {
      if (!windowRV) return false;
      const rect = elementFromSelection(windowRV.renderer.drawAreaBgS).getBoundingClientRect()
      return (!(e.clientX < rect.x || e.clientX > rect.x + rect.width ||
        e.clientY < rect.y || e.clientY > rect.y + rect.height))
    })
    if (windowHovered) {
      windowHovered.tooltip.movableCrossTooltipVisible = windowHovered.settings.get('movableCrossActive')
    }
    setTooltipVisibility(windowHovered?.tooltip.isVisible() ? 'visible' : 'hidden')
  })
  return tooltipS
}
