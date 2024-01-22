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
  const { xValues, yValues,
    xScale, yScale,
    categories, categoryOrderMap,
    keysActive, labelCallback,
    bounds, key: seriesKey, flipped,
    radii, color, renderer } = seriesData

  const data: Point[] = []
  const chartElement = elementFromSelection(renderer.chartSelection)
  const drawAreaElement = elementFromSelection(renderer.drawAreaSelection)
  const radiusDefinite = getRadiusDefinite(radii, {chart: chartElement, self: drawAreaElement})
  for (let i = 0; i < xValues.length; ++i) {
    const xVal = xValues[i]
    const yVal = yValues[i]
    const category = categories[i]
    const r = typeof radiusDefinite === "number" ? radiusDefinite : radiusDefinite.scale(radiusDefinite.values[i])
    const seriesCategory = `s-${seriesKey} c-${categoryOrderMap[category]}`
    if (!keysActive[seriesCategory]) continue
    const key = `s-${seriesKey} c-${categoryOrderMap[category]} i-${i}`
    data.push({
      label: labelCallback(category),
      styleClass: `categorical-${categoryOrderMap[category]}`,
      key,
      center: {
        x: flipped ? yScale(yVal)! : xScale(xVal)!,
        y: flipped ? xScale(xVal)! : yScale(yVal)!,
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

