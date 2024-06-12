import {elementFromSelection, Series} from "respvis-core";
import {select} from "d3";
import {tooltipSelector} from "./tooltip";

export function renderMovableCrossTooltip(series: Series) {
  const { renderer} = series
  const tooltipS = select(tooltipSelector)
  const tooltip = renderer.windowS.datum().tooltip

  const renderContent = () => {
    const active = renderer.windowS.datum().windowSettings.get('movableCrossActive')
      && tooltip.movableCrossTooltipVisible && !tooltip.seriesTooltipVisible
    const toolTipCrossStateS = tooltipS
      .selectAll('.item.tooltip--cross')
      .data(active ? [null] : [])
      .join('div')
      .classed('item tooltip--cross', true)
    const crossStateTextS =  toolTipCrossStateS.selectAll('output')
      .data(active ? [null, null] : [])
      .join('output')
    renderer.drawAreaS.classed('cursor-cross', active)
    return {toolTipCrossStateS, crossStateTextS}
  }

  const onDrawAreaMove = (e) => {
    tooltip.movableCrossTooltipVisible = renderer.windowS.datum().windowSettings.get('movableCrossActive')
    const {crossStateTextS} = renderContent()
    if (!tooltip.movableCrossTooltipVisible) return

    const backgroundE = elementFromSelection(renderer.drawAreaBgS) as Element
    const rect = backgroundE.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const { horizontal, horizontalName,
      vertical, verticalName} = series.getScaledValuesAtScreenPosition(x, y)

    const firstText = crossStateTextS.filter((d, i) => i === 0 )
    const secondText = crossStateTextS.filter((d, i) => i === 1)

    if (firstText.size() > 0) firstText.text(horizontal ? `${horizontalName}: ${horizontal}` : firstText.text())
    if (secondText.size() > 0) secondText.text(vertical ? `${verticalName}: ${vertical}` : secondText.text())
  }

  const onDrawAreaLeave = () => {
    tooltip.movableCrossTooltipVisible = false
    renderContent()
  }
  const onWindowMove = (e) => {
    const rect = elementFromSelection(renderer.drawAreaBgS).getBoundingClientRect()
    if (!(e.clientX < rect.x || e.clientX > rect.x + rect.width ||
      e.clientY < rect.y || e.clientY > rect.y + rect.height)) {
      onDrawAreaMove(e)
      return
    }
    onDrawAreaLeave(e)
  }

  renderer.windowS.on('pointermove.LeaveMovableCrossTooltip', onWindowMove)
}
