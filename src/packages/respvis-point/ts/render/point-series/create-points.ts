import {Point} from "../point";
import {defaultStyleClass} from "respvis-core";
import {PointSeries} from "./point-series";

export function createPoints<T extends boolean, R = T extends false ? Point[] : Point[][]>
(series: PointSeries, grouped: T): R {
  const {key: seriesKey, keysActive, categories} = series

  const {x, y, color} = series

  const optionalColorValues = color?.axis.scaledValues

  const pointsSingleGroup: Point[] = []
  const pointsGrouped: Point[][] = new Array(categories ? categories.categories.keyOrder.length : 1)
    .fill(0).map(() => [])

  if (!keysActive[seriesKey] && !grouped) return pointsSingleGroup as R
  if (!keysActive[seriesKey] && grouped) return pointsGrouped as R

  for (let i = 0; i < x.values.length; i++) {
    if (categories && !categories.isValueActive(i)) continue
    if (!x.isValueActive(i) || !y.isValueActive(i) || !(optionalColorValues?.isValueActive(i) ?? true)) continue
    const point = createPoint(series, i)
    pointsSingleGroup.push(point)
    if (pointsGrouped && categories) {
      const category = categories.values[i]
      const order = categories.categories.categoryOrderMap[category]
      pointsGrouped[order].push(point)
    } else pointsGrouped[0].push(point)
  }

  return (grouped === false) ? pointsSingleGroup as R : pointsGrouped! as R
}

function createPoint(series: PointSeries, i: number) {
  const category = series.categories?.values[i]
  return new Point({
    ...series.responsiveState.getPointCircle(i),
    xValue: series.responsiveState.horizontalVals().values[i],
    yValue: series.responsiveState.verticalVals().values[i],
    color: series.color?.scale(series.color?.values[i]),
    colorValue: series.color?.values[i],
    radiusValue: series.responsiveState.getRadiusValue(i),
    key: series.getCombinedKey(i) + ` i-${i}`,
    styleClass: series.categories?.categories.styleClassValues[i] ?? defaultStyleClass,
    category,
    categoryFormatted: category ? series.categories?.categories.categoryFormatMap[category] : undefined,
    label: series.labels?.getArgValid(i)
  })
}
