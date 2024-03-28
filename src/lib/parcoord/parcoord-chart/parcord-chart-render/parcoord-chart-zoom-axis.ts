import {D3ZoomEvent} from "d3";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {ParcoordSeries} from "../../parcoord-series";

export function onZoomAxisParcoord(e: D3ZoomEvent<any, any>, d: KeyedAxisValid, series: ParcoordSeries) {
  const transform = e.transform
  const axisIndex = series.axes.findIndex(axis => axis.key === d.key)
  const zoom = series.zooms[axisIndex]
  if (!zoom) return

  zoom.currentTransform = transform

  const flipped = series.responsiveState.currentlyFlipped
  const [y2, y1] = flipped ? series.axesScale.range() : series.axes[axisIndex].scaledValues.scale.range()
  const [x1, x2] = flipped ? series.axes[axisIndex].scaledValues.scale.range() : series.axesScale.range()
  const extent: [[number, number], [number, number]] = [
    [x1, y1],
    [x2, y2],
  ];
  zoom.behaviour.extent(extent).translateExtent(extent);
}
