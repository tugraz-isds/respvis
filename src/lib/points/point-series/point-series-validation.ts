import {Circle, ScaleContinuous} from '../../core';
import {getRadiusDefinite} from "../../core/data/radius/radius-util";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {RadiusArg} from "../../core/data/radius/radius-validation";
import {SeriesArgs, seriesValidation} from "../../core/render/series";

export interface Point extends Circle {
  xValue: any
  yValue: any
  label: string
  radiusValue?: any
  styleClass: string
  key: string
}

export type SeriesPointArgs = SeriesArgs & {
  radii?: RadiusArg
  color?: {
    colorDim: number[]
    colorScale: ScaleContinuous<any, string>
  };
}

export type SeriesPointValid = Required<Omit<SeriesPointArgs, 'color'>> & {
  color?: {
    colorDim: number[]
    colorScale: ScaleContinuous<any, string>
  };
}

export function seriesPointData(data: SeriesPointArgs): SeriesPointValid {
  const {radii, color} = data
  //TODO: Do clean radius validation
  const radiusesValid = radii !== undefined ? radii : 5
  return {
    ...seriesValidation(data),
    radii: radiusesValid,
    color,
  };
}

export function seriesPointCreatePoints(seriesData: SeriesPointValid): Point[] {
  const { x, y, radii, bounds,
    legend, key: seriesKey, flipped,
    color, renderer } = seriesData

  const data: Point[] = []
  const chartElement = elementFromSelection(renderer.chartSelection)
  const drawAreaElement = elementFromSelection(renderer.drawAreaSelection)
  const radiusDefinite = getRadiusDefinite(radii, {chart: chartElement, self: drawAreaElement})
  for (let i = 0; i < x.values.length; ++i) {
    const xVal = x.values[i]
    const yVal = y.values[i]
    const category = x.categories[i]
    const r = typeof radiusDefinite === "number" ? radiusDefinite : radiusDefinite.scale(radiusDefinite.values[i])
    const seriesCategory = `s-${seriesKey} c-${x.categoryOrder[category]}`
    if (!legend.keysActive[seriesCategory]) continue
    const key = `s-${seriesKey} c-${x.categoryOrder[category]} i-${i}`
    data.push({
      label: legend.labelCallback(category),
      styleClass: `categorical-${x.categoryOrder[category]}`,
      key,
      center: {
        x: flipped ? y.scale(yVal)! : x.scale(xVal)!,
        y: flipped ? x.scale(xVal)! : y.scale(yVal)!,
      },
      radius: r ?? 5,
      xValue: xVal,
      yValue: yVal,
      color: color?.colorScale(color.colorDim[i]),
      radiusValue: typeof radiusDefinite !== "number" ? radiusDefinite.values[i] : undefined
    });
  }

  return data;
}

