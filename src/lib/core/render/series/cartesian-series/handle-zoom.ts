import {CartesianSeries} from "./cartesian-series";
import {throttle} from "../../../utilities/d3/util";
import {D3ZoomEvent} from "d3";

export function handleZoom(series: CartesianSeries) {
  const throttledZoom = throttle((e) => onZoomDrawArea(e, series), 50)
  const onZoom = (e) => {
    throttledZoom.func(e)
    if (e.sourceEvent.type === "wheel") {
      series.originalSeries.renderer.windowS.dispatch('resize')
    }
  }
  const zoom = series.zoom
  if (!zoom) return
  series.renderer.drawAreaS
    .call(zoom.behaviour.scaleExtent([zoom.out, zoom.in]).on('zoom.zoom', onZoom))
}

function onZoomDrawArea(e: D3ZoomEvent<any, any>, series: CartesianSeries) {
  const transform = e.transform
  const originalSeries = series.originalSeries
  if (!originalSeries.zoom) return
  originalSeries.zoom.currentTransform = transform

  const {horizontal, verticalInverted} = originalSeries.responsiveState.drawAreaRange()
  const extent: [[number, number], [number, number]] = [
    [horizontal[0], verticalInverted[0]],
    [horizontal[1], verticalInverted[1]],
  ];
  originalSeries.zoom.behaviour.extent(extent).translateExtent(extent);
}
