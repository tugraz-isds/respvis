import {CartesianSeries} from "./cartesian-series";
import {throttle} from "respvis-core";
import {D3ZoomEvent, zoomIdentity} from "d3";

export function handleZoom(series: CartesianSeries) {
  const throttledZoom = throttle((e) => onZoomDrawArea(e, series), 50)
  const onZoom = (e) => {
    throttledZoom.func(e)
    series.original.renderer.windowS.dispatch('resize')
  }
  const zoom = series.zoom
  if (!zoom) return
  series.renderer.drawAreaS.call(zoom.behaviour.on('zoom.zoom', onZoom))
}

function onZoomDrawArea(e: D3ZoomEvent<any, any>, series: CartesianSeries) {
  const transform = e.transform
  const originalSeries = series.original
  const zoom = originalSeries.zoom
  if (!zoom) return
  zoom.currentTransform = (e.transform.k === 1) ? zoomIdentity : transform


  const {horizontal, verticalInverted} = originalSeries.responsiveState.drawAreaRange()
  const extent: [[number, number], [number, number]] = [
    [horizontal[0], verticalInverted[0]],
    [horizontal[1], verticalInverted[1]],
  ];
  zoom.behaviour.extent(extent).translateExtent(extent).scaleExtent([zoom.out, zoom.in])
}
