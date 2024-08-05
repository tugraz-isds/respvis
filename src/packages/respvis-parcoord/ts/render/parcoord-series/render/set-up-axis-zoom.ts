import {Selection} from "d3";
import {throttle} from "respvis-core";
import {onDragEndAxisParcoord} from "./on-drag-axis";
import {KeyedAxis} from "../../validate-keyed-axis";
import {onZoomAxis} from "./on-zoom-axis";

export function setUpAxisZoom(axisS: Selection<SVGGElement, KeyedAxis>, i: number) {
  const axisD = axisS.datum()
  const zoomB = axisD.series.renderData.zooms[i]
  if (!zoomB) return

  const throttledZoom = throttle((e) => onZoomAxis(e, axisD), 30)

  const onZoom = (e) => {
    if (e.sourceEvent.type === "dblclick") return
    throttledZoom.func(e)
    axisD.series.renderer.windowS.dispatch('resize')
  }
  const onZoomEnd = (e) => {
    if (e.sourceEvent.type === "mouseup") {
      onDragEndAxisParcoord(axisD)
    }
  }

  axisS.call(zoomB.behaviour.scaleExtent([zoomB.out, zoomB.in])
    .on('zoom.zoomAndDrag', onZoom)
    .on('end.zoomAndDrag', onZoomEnd)
  )
}
