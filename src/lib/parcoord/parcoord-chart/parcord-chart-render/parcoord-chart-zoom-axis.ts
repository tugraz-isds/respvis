import {D3ZoomEvent, drag, Selection} from "d3";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {throttle} from "../../../core/utilities/d3/util";
import {onDragAxisParcoord} from "./parcoord-chart-drag-axis";

export function handleAxisZoomAndDrag(axisS:  Selection<SVGGElement, KeyedAxisValid>, i: number) {
  const axisD = axisS.datum()
  const throttledZoom = throttle((e) => onZoomAxisParcoord(e, axisD), 50)
  const throttledDrag = throttle((e) => onDragAxisParcoord(e, axisD, axisD.renderer.drawAreaBgS), 50)
  const onZoom = (e) => {
    throttledZoom.func(e)
    if (e.sourceEvent.type === "mousemove" || e.sourceEvent.type === "touchmove") {
      throttledDrag.func(e)
    }
    if (e.sourceEvent.type === "wheel") {
      axisD.series.originalSeries.renderer.windowS.dispatch('resize')
    }
  }
  const zoomB = axisD.series.zooms[i]
  if (!zoomB) {
    axisS.call(drag().on("drag.dragAxis", (e) => throttledDrag.func(e)))
    return
  }
  axisS.call(zoomB.behaviour.scaleExtent([zoomB.out, zoomB.in]).on('zoom.zoomAndDrag', onZoom))
}

function onZoomAxisParcoord(e: D3ZoomEvent<any, any>, d: KeyedAxisValid) {
  const transform = e.transform
  const originalSeries = d.series.originalSeries
  const axisIndex = originalSeries.axes.findIndex(axis => axis.key === d.key)
  const zoom = originalSeries.zooms[axisIndex]
  if (!zoom) return

  zoom.currentTransform = transform

  const flipped = originalSeries.responsiveState.currentlyFlipped
  const [y2, y1] = flipped ? originalSeries.axesScale.range() : originalSeries.axes[axisIndex].scaledValues.scale.range()
  const [x1, x2] = flipped ? originalSeries.axes[axisIndex].scaledValues.scale.range() : originalSeries.axesScale.range()
  const extent: [[number, number], [number, number]] = [
    [x1, y1],
    [x2, y2],
  ];
  zoom.behaviour.extent(extent).translateExtent(extent);
}
