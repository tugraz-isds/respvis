import {D3ZoomEvent, drag, Selection} from "d3";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {throttle} from "../../../core/utilities/d3/util";
import {onDragAxisParcoord, onDragEndAxisParcord} from "./parcoord-chart-drag-axis";
import {arrayOrder} from "../../../core";

export function handleAxisZoomAndDrag(axisS: Selection<SVGGElement, KeyedAxisValid>, i: number) {
  const axisD = axisS.datum()
  const throttledZoom = throttle((e) => onZoomAxisParcoord(e, axisD), 30)
  const throttledDrag = throttle((e) => onDragAxisParcoord(e, axisD, axisD.renderer.drawAreaBgS), 30)
  const onZoom = (e) => {
    throttledZoom.func(e)
    if (e.sourceEvent.type === "mousemove" || e.sourceEvent.type === "touchmove") {
      throttledDrag.func(e)
      axisD.series.originalSeries.renderer.windowS.dispatch('resize')
    }
    if (e.sourceEvent.type === "wheel") {
      axisD.series.originalSeries.renderer.windowS.dispatch('resize')
    }
  }
  const onZoomEnd = (e) => {
    if (e.sourceEvent.type === "mouseup") { onDragEndAxisParcord(e, axisD) }
  }
  const zoomB = axisD.series.zooms[i]
  if (!zoomB) {
    axisS.call(drag()
      .on("drag.dragAxis", (e) => throttledDrag.func(e))
      .on("end.dragAxis", (e) => onDragEndAxisParcord(e, axisD))
    ).call(addCursorClasses)
    return
  }
  axisS.call(zoomB.behaviour.scaleExtent([zoomB.out, zoomB.in])
    .on('zoom.zoomAndDrag', onZoom)
    .on('end.zoomAndDrag', onZoomEnd)
  ).call(addCursorClasses)
}

function addCursorClasses(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const originalSeries = axisS.datum().series.originalSeries
  const flipped = originalSeries.responsiveState.currentlyFlipped
  const axisIndex = originalSeries.axes.findIndex(axis => axis.key === axisS.datum().key)
  const percentageRange = originalSeries.axesPercentageScale.range()
  const orderArray = arrayOrder(percentageRange)
  axisS.classed('cursor', true)
  axisS.classed('cursor--drag-horizontal', !flipped)
  axisS.classed('cursor--drag-right-only',!flipped && orderArray[axisIndex] === 1)
  axisS.classed('cursor--drag-left-only',!flipped && orderArray[axisIndex] === orderArray.length)
  axisS.classed('cursor--drag-vertical', flipped)
  axisS.classed('cursor--drag-up-only',flipped && orderArray[axisIndex] === 1)
  axisS.classed('cursor--drag-down-only',flipped && orderArray[axisIndex] === orderArray.length)
}

function onZoomAxisParcoord(e: D3ZoomEvent<any, any>, d: KeyedAxisValid) {
  const transform = e.transform
  const originalSeries = d.series.originalSeries
  const axisIndex = originalSeries.axes.findIndex(axis => axis.key === d.key)
  const zoom = originalSeries.zooms[axisIndex]
  if (!zoom) return

  zoom.currentTransform = transform

  const {horizontal, verticalInverted} = originalSeries.responsiveState.drawAreaRange()
  const extent: [[number, number], [number, number]] = [
    [horizontal[0], verticalInverted[0]],
    [horizontal[1], verticalInverted[1]],
  ];
  zoom.behaviour.extent(extent).translateExtent(extent);
}
