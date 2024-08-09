import {D3ZoomEvent, zoomIdentity} from "d3";
import {KeyedAxis} from "../../validate-keyed-axis";

export function onZoomAxis(e: D3ZoomEvent<any, any>, d: KeyedAxis) {
  const transform = e.transform
  const {axes, zooms} = d.series.originalData
  const axisIndex = axes.findIndex(axis => axis.key === d.key)
  const zoom = zooms[axisIndex]
  if (!zoom) return
  zoom.currentTransform = transform
  zoom.currentTransform = (e.sourceEvent.type === "mousemove" && e.transform.k === 1) ? zoomIdentity : transform

  const {horizontal, verticalInverted} = d.series.responsiveState.drawAreaRange()
  const extent: [[number, number], [number, number]] = [
    [horizontal[0], verticalInverted[0]],
    [horizontal[1], verticalInverted[1]],
  ];
  zoom.behaviour.extent(extent).translateExtent(extent);
}
