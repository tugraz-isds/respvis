import {D3ZoomEvent, drag, Selection, zoomIdentity} from "d3";
import {arrayOrder, throttle} from "respvis-core";
import {onDragAxisParcoord, onDragEndAxisParcoord} from "./on-drag-axis";
import {KeyedAxis} from "../../validate-keyed-axis";

export function handleAxisZoomAndDrag(axisS: Selection<SVGGElement, KeyedAxis>, i: number) {
  const axisD = axisS.datum()
  const throttledZoom = throttle((e) => onZoomAxis(e, axisD), 30)
  const throttledDrag = throttle((e) => onDragAxisParcoord(e, axisD, axisD.renderer.drawAreaBgS), 30)
  const onDrag = (e) => {
    if (e.sourceEvent.type === "mousemove" || e.sourceEvent.type === "touchmove") {
      throttledDrag.func(e)
      axisD.series.originalSeries.renderer.windowS.dispatch('resize')
    }
  }
  const onZoom = (e) => {
    if (e.sourceEvent.type === "dblclick") return
    throttledZoom.func(e)
    axisD.series.originalSeries.renderer.windowS.dispatch('resize')
  }
  const onZoomEnd = (e) => {
    if (e.sourceEvent.type === "mouseup") {
      onDragEndAxisParcoord(axisD)
    }
  }
  axisS.selectAll('.title-wrapper').call(drag().on("drag.dragAxis", onDrag)
    .on("end.dragAxis", () => onDragEndAxisParcoord(axisD))
  )
  axisS.call(addCursorClasses)

  const zoomB = axisD.series.zooms[i]
  if (!zoomB) return
  axisS.call(zoomB.behaviour.scaleExtent([zoomB.out, zoomB.in])
    .on('zoom.zoomAndDrag', onZoom)
    .on('end.zoomAndDrag', onZoomEnd)
  )
}

function addCursorClasses(axisS: Selection<SVGGElement, KeyedAxis>) {
  const originalSeries = axisS.datum().series.originalSeries
  const flipped = originalSeries.responsiveState.currentlyFlipped
  const axisIndex = originalSeries.axes.findIndex(axis => axis.key === axisS.datum().key)
  const percentageRange = originalSeries.axesPercentageScale.range()
  const orderArray = arrayOrder(percentageRange)
  const titleWrapperS = axisS.selectAll('.title-wrapper')
  titleWrapperS.classed('cursor', true)
    .classed('cursor--drag-horizontal', !flipped)
    .classed('cursor--drag-right-only', !flipped && orderArray[axisIndex] === 1)
    .classed('cursor--drag-left-only', !flipped && orderArray[axisIndex] === orderArray.length)
    .classed('cursor--drag-vertical', flipped)
    .classed('cursor--drag-up-only', flipped && orderArray[axisIndex] === 1)
    .classed('cursor--drag-down-only', flipped && orderArray[axisIndex] === orderArray.length)
}

function onZoomAxis(e: D3ZoomEvent<any, any>, d: KeyedAxis) {
  const transform = e.transform
  const originalSeries = d.series.originalSeries
  const axisIndex = originalSeries.axes.findIndex(axis => axis.key === d.key)
  const zoom = originalSeries.zooms[axisIndex]
  if (!zoom) return
  zoom.currentTransform = transform
  zoom.currentTransform = (e.sourceEvent.type === "mousemove" && e.transform.k === 1) ? zoomIdentity : transform

  const {horizontal, verticalInverted} = originalSeries.responsiveState.drawAreaRange()
  const extent: [[number, number], [number, number]] = [
    [horizontal[0], verticalInverted[0]],
    [horizontal[1], verticalInverted[1]],
  ];
  zoom.behaviour.extent(extent).translateExtent(extent);
}
