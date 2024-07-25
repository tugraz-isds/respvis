import {Point} from "../point";
import {defaultStyleClass, Key} from "respvis-core";
import {PointSeries} from "./point-series";

export function createPoints<T extends boolean, R = T extends false ? Point[] : Point[][]>
(series: PointSeries, grouped: T): R {
  const {key: seriesKey, keysActive, categories,
    x, y, color, radii,
  } = series.renderData

  const optionalColorValues = color?.axis.scaledValues
  const optionalRadiiValues = typeof radii === 'object' && 'tag' in radii ? radii.axis.scaledValues : undefined

  const pointsSingleGroup: Point[] = []
  const pointsGrouped: Point[][] = new Array(categories ? categories.categories.categoryArray.length : 1)
    .fill(0).map(() => [])

  if (!keysActive[seriesKey] && !grouped) return pointsSingleGroup as R
  if (!keysActive[seriesKey] && grouped) return pointsGrouped as R

  for (let i = 0; i < x.values.length; i++) {
    if (categories && !categories.isValueActive(i)) continue
    if (!x.isValueActive(i) || !y.isValueActive(i) ||
      !(optionalColorValues?.isValueActive(i) ?? true) || !(optionalRadiiValues?.isValueActive(i) ?? true)) continue
    const point = createPoint(series, i)
    pointsSingleGroup.push(point)
    if (pointsGrouped && categories) {
      const category = categories.values[i]
      const order = categories.categories.categoryMap[category].order
      pointsGrouped[order].push(point)
    } else pointsGrouped[0].push(point)
  }

  return (grouped === false) ? pointsSingleGroup as R : pointsGrouped! as R
}

function createPoint(series: PointSeries, i: number) {
  const {renderData, responsiveState} = series
  const {categories, color, labels} = renderData
  const category = categories?.values[i]
  return new Point({
    ...responsiveState.getPointCircle(i),
    xValue: responsiveState.horizontalVals().values[i],
    yValue: responsiveState.verticalVals().values[i],
    color: color?.scale(color?.values[i]),
    colorValue: color?.values[i],
    radiusValue: responsiveState.getRadiusValue(i),
    key: new Key(renderData.getCombinedKey(i) + ` i-${i}`),
    styleClass: categories?.getStyleClass(i) ?? defaultStyleClass,
    category,
    categoryFormatted: category ? categories?.categories.categoryMap[category].formatValue : undefined,
    label: labels?.getLabelData(i)
  })
}
