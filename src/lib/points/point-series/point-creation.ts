import {Point} from "./point";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";
import {getRadiusScaledValues} from "../../core/data/radius/radius-util";
import {PointScaleHandler} from "../../core/data/scale/geometry-scale-handler/point-scale-handler";
import {PointSeries} from "./point-series-validation";
import {defaultStyleClass} from "../../core/constants/other";

export function seriesPointCreatePoints(seriesData: PointSeries): Point[] {
  const {key: seriesKey, keysActive, color, renderer, categories} = seriesData
  const chartElement = elementFromSelection(renderer.chartSelection)
  const flipped = getCurrentRespVal(seriesData.flipped, {chart: chartElement})

  const [x, y] = [seriesData.x.cloneFiltered(), seriesData.y.cloneFiltered()]
  const drawAreaElement = elementFromSelection(renderer.drawAreaSelection)
  const radii = getRadiusScaledValues(seriesData.radii, {chart: chartElement, self: drawAreaElement})
  const geometryHandler = new PointScaleHandler({originalYValues: y, originalXValues: x, flipped, radii})

  if (!keysActive[seriesKey]) return []
  const data: Point[] = []
  for (let i = 0; i < x.values.length; i++) {
    if (categories && !categories.isKeyActiveByIndex(i)) continue
    if (!x.isKeyActiveByIndex(i) || !y.isKeyActiveByIndex(i)) continue

    data.push({
      ...geometryHandler.getPointCircle(i),
      xValue: geometryHandler.getCurrentXValues().getScaledValue(i),
      yValue: geometryHandler.getCurrentYValues().getScaledValue(i),
      color: color?.scale(color?.values[i]),
      radiusValue: geometryHandler.getRadius(i),
      key: seriesData.getCombinedKey(i) + ` i-${i}`,
      styleClass: seriesData.categories?.categories.styleClassValues[i] ?? defaultStyleClass,
      label: seriesData.labelCallback(seriesData.categories?.values[i] ?? ''),
    })
  }

  return data;
}
