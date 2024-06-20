import {Point} from "../point";
import {defaultStyleClass, elementFromSelection, getRadiusScaledValues} from "respvis-core";
import {PointScaleHandler} from "./geometry-scale-handler/point-scale-handler";
import {PointSeries} from "./point-series";

export function createPoints<T extends boolean, R = T extends false ? Point[] : Point[][]>
(seriesData: PointSeries, grouped: T): R {
  const {key: seriesKey, keysActive, renderer, categories, responsiveState} = seriesData
  const chartElement = elementFromSelection(renderer.chartS)
  const flipped = responsiveState.currentlyFlipped

  const {x, y, color} = seriesData
  const drawAreaElement = elementFromSelection(renderer.drawAreaS)
  const radii = getRadiusScaledValues(seriesData.radii, {chart: chartElement, self: drawAreaElement})
  const geometryHandler = new PointScaleHandler({originalYValues: y, originalXValues: x, flipped, radii, renderer})

  const optionalColorValues = color?.axis.scaledValues

  const pointsSingleGroup: Point[] = []
  const pointsGrouped: Point[][] = new Array(categories ? categories.categories.keyOrder.length : 1)
    .fill(0).map(() => [])

  if (!keysActive[seriesKey] && !grouped) return pointsSingleGroup as R
  if (!keysActive[seriesKey] && grouped) return pointsGrouped as R

  for (let i = 0; i < x.values.length; i++) {
    if (categories && !categories.isValueActive(i)) continue
    if (!x.isValueActive(i) || !y.isValueActive(i) || !(optionalColorValues?.isValueActive(i) ?? true)) continue
    const point = createPoint({geometryHandler, seriesData, i})
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
  seriesData: PointSeries
}

function createPoint(props: CreatePointProps) {
  const {geometryHandler, i, seriesData} = props
  const category = seriesData.categories?.values[i]
  return new Point({
    ...geometryHandler.getPointCircle(i),
    xValue: geometryHandler.getCurrentXValues().values[i],
    yValue: geometryHandler.getCurrentYValues().values[i],
    color: seriesData.color?.scale(seriesData.color?.values[i]),
    colorValue: seriesData.color?.values[i],
    radiusValue: geometryHandler.getRadiusValue(i),
    key: seriesData.getCombinedKey(i) + ` i-${i}`,
    styleClass: seriesData.categories?.categories.styleClassValues[i] ?? defaultStyleClass,
    category,
    categoryFormatted: category ? seriesData.categories?.categories.categoryFormatMap[category] : undefined,
    label: seriesData.labels?.getArgValid(i)
  })
}
