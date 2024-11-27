import {DataSeries, elementFromSelection} from "respvis-core";
import {select} from "d3";
import {tooltipSelector} from "./tooltip";

export function renderMovableCrossTooltip(series: DataSeries) {
  const { renderer} = series
  const tooltipS = select(tooltipSelector)
  const tooltip = renderer.windowS.datum().tooltip

  const renderContent = (active: boolean) => {

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

  const onDrawAreaMove = (e: PointerEvent, active: boolean) => {
    const windowD = renderer.windowS.datum()
    tooltip.movableCrossTooltipVisible = windowD.settings.get('movableCrossActive')

    const {crossStateTextS} = renderContent(active)
    if (!active) return

    const positionStrategy = windowD.tooltip.positionStrategyInspect
    windowD.tooltip.applyPositionStrategy(e, positionStrategy)

    const backgroundE = elementFromSelection(renderer.drawAreaBgS) as Element
    const rect = backgroundE.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const screenData  = series.getScaledValuesAtScreenPosition(x, y)
    const { horizontal, horizontalName, vertical, verticalName} = screenData

    const firstText = crossStateTextS.filter((d, i) => i === 0 )
    const secondText = crossStateTextS.filter((d, i) => i === 1)

    if (firstText.size() > 0) firstText.text(horizontal ? `${horizontalName}: ${horizontal}` : firstText.text())
    if (secondText.size() > 0) secondText.text(vertical ? `${verticalName}: ${vertical}` : secondText.text())

    tooltip.onInspectMove(screenData)
  }

  const onDrawAreaLeave = (active: boolean) => {
    tooltip.movableCrossTooltipVisible = false
    renderContent(active)
  }
  const onWindowMove = (e) => {
    const active = renderer.windowS.datum().settings.get('movableCrossActive')
      && tooltip.movableCrossTooltipVisible && !tooltip.seriesTooltipVisible

    const rect = elementFromSelection(renderer.drawAreaBgS).getBoundingClientRect()
    if (!(e.clientX < rect.x || e.clientX > rect.x + rect.width ||
      e.clientY < rect.y || e.clientY > rect.y + rect.height)) {
      onDrawAreaMove(e, active)
      return
    }
    onDrawAreaLeave(active)
  }

  renderer.windowS.on('pointermove.LeaveMovableCrossTooltip', onWindowMove)
}
