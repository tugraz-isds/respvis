import {Point} from "./point";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";
import {getRadiusScaledValues} from "../../core/data/radius/radius-util";
import {PointScaleHandler} from "../../core/data/scale/geometry-scale-handler/point-scale-handler";
import {getSeriesItemCategoryData} from "../../core/render/series";
import {SeriesPointValid} from "./point-series-validation";

export function seriesPointCreatePoints(seriesData: SeriesPointValid): Point[] {
  const {key: seriesKey, keysActive, color, renderer} = seriesData
  const chartElement = elementFromSelection(renderer.chartSelection)
  const flipped = getCurrentRespVal(seriesData.flipped, {chart: chartElement})

  const [x, y] = [seriesData.x.cloneFiltered(), seriesData.y.cloneFiltered()]
  const drawAreaElement = elementFromSelection(renderer.drawAreaSelection)
  const radii = getRadiusScaledValues(seriesData.radii, {chart: chartElement, self: drawAreaElement})
  const geometryHandler = new PointScaleHandler({originalYValues: y, originalXValues: x, flipped, radii})

  if (!keysActive[seriesKey]) return []
  const data: Point[] = []
  for (let i = 0; i < x.values.length; i++) {
    const {
      key, seriesCategory, styleClass, label,
      axisCategoryKeyX, axisCategoryKeyY
    } = getSeriesItemCategoryData({...seriesData, index: i, flipped})

    if (keysActive[seriesCategory] === false) continue
    if (!x.isKeyActive(axisCategoryKeyX) || !y.isKeyActive(axisCategoryKeyY)) continue

    data.push({
      label, styleClass, key,
      ...geometryHandler.getPointCircle(i),
      xValue: geometryHandler.getCurrentXValues().getScaledValue(i),
      yValue: geometryHandler.getCurrentYValues().getScaledValue(i),
      color: color?.scale(color?.values[i]),
      radiusValue: geometryHandler.getRadius(i)
    })
  }

  return data;
}
