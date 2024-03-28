import {D3ZoomEvent, Selection} from "d3";
import {ParcoordSeries} from "../../parcoord-series";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {relateDragWayToSelection} from "../../../core/utilities/d3/drag";

export function onDragAxisParcoord(e: D3ZoomEvent<any, any>, d: KeyedAxisValid, drawAreaBackgroundS: Selection<SVGRectElement>, series: ParcoordSeries) {
  const dragWay = relateDragWayToSelection(e, drawAreaBackgroundS)
  if (!dragWay) return
  const oldPercentageDomain = series.axesPercentageScale.domain()
  const index = oldPercentageDomain.indexOf(d.key)
  const newPercentageRange = series.axesPercentageScale.range()
  newPercentageRange[index] = dragWay.percentX
  series.axesPercentageScale.range(newPercentageRange)
}
