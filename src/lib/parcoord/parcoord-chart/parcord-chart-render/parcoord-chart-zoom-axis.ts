import {D3ZoomEvent} from "d3";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {ParcoordSeries} from "../../parcoord-series";

export function onZoomAxisParcoord(e: D3ZoomEvent<any, any>, d: KeyedAxisValid, series: ParcoordSeries) {
  const transform = e.transform
  const axisIndex = series.axes.findIndex(axis => axis.key === d.key)
  const zoom = series.zooms[axisIndex]
  if (!zoom) return

  zoom.currentTransform = transform

  const [y1, heightTranslate] = series.axes[axisIndex].scaledValues.scale.range()
  const [x1, widthTranslate] = series.axesScale.range()
  const extent: [[number, number], [number, number]] = [
    [x1, heightTranslate],
    [widthTranslate, y1],
  ];
  zoom.behaviour.extent(extent).translateExtent(extent);
}
