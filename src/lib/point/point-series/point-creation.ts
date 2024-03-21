import {Point} from "./point";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";
import {getRadiusScaledValues} from "../../core/data/radius/radius-util";
import {PointScaleHandler} from "../../core/data/scale/geometry-scale-handler/point-scale-handler";
import {PointSeries} from "./point-series-validation";
import {defaultStyleClass} from "../../core/constants/other";
import {Series} from "../../core/render/series";
import {ColorContinuous} from "../../core/data/color-continuous/color-continuous";

export function seriesPointCreatePoints<T extends boolean, R = T extends false ? Point[] : Point[][]>
(seriesData: PointSeries, grouped: T) : R {
  const {key: seriesKey, keysActive, color, renderer, categories} = seriesData
  const chartElement = elementFromSelection(renderer.chartSelection)
  const flipped = getCurrentRespVal(seriesData.flipped, {chart: chartElement})

  const [x, y] = [seriesData.x.cloneFiltered(), seriesData.y.cloneFiltered()]
  const drawAreaElement = elementFromSelection(renderer.drawAreaSelection)
  const radii = getRadiusScaledValues(seriesData.radii, {chart: chartElement, self: drawAreaElement})
  const geometryHandler = new PointScaleHandler({originalYValues: y, originalXValues: x, flipped, radii, renderer})

  const pointsSingleGroup: Point[] = []
  const pointsGrouped: Point[][] = new Array(categories ? categories.categories.keyOrder.length : 1)
    .fill(0).map(() => [])

  if (!keysActive[seriesKey] && !grouped) return pointsSingleGroup as R
  if (!keysActive[seriesKey] && grouped) return pointsGrouped as R

  for (let i = 0; i < x.values.length; i++) {
    if (categories && !categories.isKeyActiveByIndex(i)) continue
    if (!x.isKeyActiveByIndex(i) || !y.isKeyActiveByIndex(i)) continue
    const point = createPoint({geometryHandler, seriesData, i, color})
    pointsSingleGroup.push(point)
    if (pointsGrouped && categories) {
      const category = categories.values[i]
      const order = categories.categories.categoryOrderMap[category]
      pointsGrouped[order].push(point)
    } else pointsGrouped[0].push(point)
  }

  return (grouped === false) ? pointsSingleGroup as R : pointsGrouped! as R
}



type CreatePointProps = {
  geometryHandler: PointScaleHandler
  i: number
  color?: ColorContinuous,
  seriesData: Series
}
function createPoint(props: CreatePointProps): Point {
  const {geometryHandler, i, color, seriesData} = props
  return  {
    ...geometryHandler.getPointCircle(i),
    xValue: geometryHandler.getCurrentXValues().values[i],
    yValue: geometryHandler.getCurrentYValues().values[i],
    color: color?.scale(color?.values[i]),
    radiusValue: geometryHandler.getRadiusValue(i),
    key: seriesData.getCombinedKey(i) + ` i-${i}`,
    styleClass: seriesData.categories?.categories.styleClassValues[i] ?? defaultStyleClass,
    label: seriesData.labelCallback(seriesData.categories?.values[i] ?? ''),
  }
}
