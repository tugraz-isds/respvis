import {D3ZoomEvent, Selection} from "d3";
import {ParcoordSeries} from "../../parcoord-series";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";

export function onDragAxisParcoord(e: D3ZoomEvent<any, any>, d: KeyedAxisValid, drawAreaBackgroundS: Selection<SVGRectElement>, series: ParcoordSeries) {
  // console.log("Drag", e)
  const rect = (drawAreaBackgroundS.node() as Element)?.getBoundingClientRect();
  const event = e.sourceEvent
  if (!rect || !event) return
  let mouseX = event.x - rect.left
  mouseX = mouseX < 0 ? 0 : mouseX > rect.width ? rect.width : mouseX
  const percentX = mouseX / rect.width
  // console.log(e.clientX, rect.left, mouseX, percentX)
  // const mouseY = e.clientY - rect.top
  const oldPercentageDomain = series.axesPercentageScale.domain()
  const index = oldPercentageDomain.indexOf(d.key)
  const newPercentageRange = series.axesPercentageScale.range()
  // console.log(oldPercentageDomain, d.key, index, newPercentageRange)
  newPercentageRange[index] = percentX
  series.axesPercentageScale.range(newPercentageRange)
}
