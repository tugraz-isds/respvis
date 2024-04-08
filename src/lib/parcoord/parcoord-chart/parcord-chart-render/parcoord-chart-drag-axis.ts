import {D3ZoomEvent, Selection} from "d3";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {relateDragWayToSelection} from "../../../core/utilities/d3/drag";
import {arrayOrder} from "../../../core";

export function onDragAxisParcoord(e: D3ZoomEvent<any, any>, d: KeyedAxisValid, drawAreaBackgroundS: Selection<SVGRectElement>) {
  const dragWay = relateDragWayToSelection(e, drawAreaBackgroundS)
  if (!dragWay) return
  const originalSeries = d.series.originalSeries
  const oldPercentageDomain = originalSeries.axesPercentageScale.domain()
  const index = oldPercentageDomain.indexOf(d.key)
  const newPercentageRange = originalSeries.axesPercentageScale.range()
  newPercentageRange[index] = d.series.responsiveState.currentlyFlipped ? 1 - dragWay.fromTopPercent : dragWay.fromLeftPercent
  originalSeries.axesPercentageScale.range(newPercentageRange)
}

export function onDragEndAxisParcord(e: D3ZoomEvent<any, any>, d: KeyedAxisValid) {
  const originalSeries = d.series.originalSeries
  const catchAxesActive = originalSeries.renderer.windowS.datum().windowSettings.parcoordCatchAxes
  if (!catchAxesActive) return
  const percentageRange = originalSeries.axesPercentageScale.range()
  const order = arrayOrder(percentageRange)
  const newPercentageRange = order.map((eOrder) => (eOrder - 1) / (order.length - 1))
  originalSeries.axesPercentageScale.range(newPercentageRange)
  originalSeries.renderer.windowS.dispatch('resize')
}



