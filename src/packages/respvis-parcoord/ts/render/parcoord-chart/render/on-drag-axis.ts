import {D3ZoomEvent, Selection} from "d3";
import {mapArrayToOrders, relateDragWayToSelection} from "respvis-core";
import {KeyedAxis} from "../../validate-keyed-axis";

export function onDragAxisParcoord(e: D3ZoomEvent<any, any>, d: KeyedAxis, drawAreaBackgroundS: Selection<SVGRectElement>) {
  const dragWay = relateDragWayToSelection(e, drawAreaBackgroundS)
  if (!dragWay) return
  const originalSeries = d.series.originalSeries
  const oldPercentageDomain = originalSeries.axesPercentageScale.domain()
  const axisIndex = oldPercentageDomain.indexOf(d.key)
  const newPercentageRange = originalSeries.axesPercentageScale.range()

  const oldPercentage = originalSeries.axesPercentageScale.range()[axisIndex]
  const newPercentage = d.series.responsiveState.currentlyFlipped ? 1 - dragWay.fromTopPercent : dragWay.fromLeftPercent
  newPercentageRange.forEach((currP, currPI) => {
    if (currP === newPercentage && currPI !== axisIndex) {
      newPercentageRange[currPI] = currP + (oldPercentage > newPercentage ? 0.01 : -0.01)
    }
  })

  newPercentageRange[axisIndex] = d.series.responsiveState.currentlyFlipped ? 1 - dragWay.fromTopPercent : dragWay.fromLeftPercent
  originalSeries.axesPercentageScale.range(newPercentageRange)
}

export function onDragEndAxisParcoord(d: KeyedAxis) {
  const originalSeries = d.series.originalSeries

  const equidistantAxesActive = originalSeries.renderer.windowS.datum().windowSettings.get('parcoordEquidistantAxes')
  if (!equidistantAxesActive) return
  const percentageRange = originalSeries.axesPercentageScale.range()
  const order = mapArrayToOrders(percentageRange)

  const newPercentageRange = order.map((eOrder) => (eOrder - 1) / (order.length - 1))
  originalSeries.axesPercentageScale.range(newPercentageRange)
  originalSeries.renderer.windowS.dispatch('resize')
}



