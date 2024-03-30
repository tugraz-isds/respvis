import {D3ZoomEvent, Selection} from "d3";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {relateDragWayToSelection} from "../../../core/utilities/d3/drag";

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
