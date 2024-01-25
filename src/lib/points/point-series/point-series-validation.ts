import {getRadiusDefinite} from "../../core/data/radius/radius-util";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {RadiusArg} from "../../core/data/radius/radius-validation";
import {SeriesArgs, SeriesUserArgs, SeriesValid, seriesValidation} from "../../core/render/series";
import {Point} from "./point";
import {ColorContinuous} from "../../core/data/color-continuous/color-continuous";

export type SeriesPointUserArgs = SeriesUserArgs & {
  radii?: RadiusArg
  color?: ColorContinuous
}

export type SeriesPointArgs = SeriesPointUserArgs & SeriesArgs

export type SeriesPointValid = SeriesValid & {
  color?: ColorContinuous
  radii: RadiusArg
}

export function seriesPointValidation(data: SeriesPointArgs): SeriesPointValid {
  const {radii, color} = data
  //TODO: Do clean radius validation
  return {
    ...seriesValidation(data),
    radii: radii !== undefined ? radii : 5,
    color,
  };
}

export function seriesPointCreatePoints(seriesData: SeriesPointValid): Point[] {
  const { x, y,
    categories, labelCallback,
    bounds, flipped,
    key: seriesKey, keysActive,
    radii, color, renderer } = seriesData

  if (!keysActive[seriesKey]) return []
  const data: Point[] = []
  const chartElement = elementFromSelection(renderer.chartSelection)
  const drawAreaElement = elementFromSelection(renderer.drawAreaSelection)
  const radiusDefinite = getRadiusDefinite(radii, {chart: chartElement, self: drawAreaElement})
  for (let i = 0; i < x.values.length; ++i) {
    const xVal = x.values[i]
    const yVal = y.values[i]
    const r = typeof radiusDefinite === "number" ? radiusDefinite : radiusDefinite.scale(radiusDefinite.values[i])
    const category = categories?.values[i]
    const categoryKey = categories?.valueKeys[i]
    const seriesCategory = `${seriesKey}${categoryKey ? ` ${categoryKey}` : ''}`
    if (!keysActive[seriesCategory]) continue //TODO: fix keys this!
    const key = `${seriesCategory} i-${i}`
    data.push({
      label: labelCallback(category ?? ''),
      styleClass: (categories && category) ? `categorical-${categories.orderMap[category]}` : 'categorical-0',
      key,
      center: {
        x: flipped ? y.scale(yVal)! : x.scale(xVal)!,
        y: flipped ? x.scale(xVal)! : y.scale(yVal)!,
      },
      radius: r ?? 5,
      xValue: xVal,
      yValue: yVal,
      color: color?.scale(color?.values[i]),
      radiusValue: typeof radiusDefinite !== "number" ? radiusDefinite.values[i] : undefined
    });
  }

  return data;
}

