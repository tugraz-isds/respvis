import {SeriesConfigTooltips, seriesConfigTooltipsData,} from '../tooltip';
import {AxisValid, Circle, ScaleAny, ScaleContinuous} from '../core';
import {Size} from '../core';
import {LegendValid} from "../legend";

export interface Point extends Circle {
  xValue: any
  yValue: any
  label: string
  radiusValue?: any
  styleClass: string
  key: string
}

export type SeriesPointArgs = Partial<SeriesConfigTooltips<SVGCircleElement, Point>> & {
  x: AxisValid
  y: AxisValid
  radiuses?: number | {
    radiusDim: number[]
    scale: ScaleAny<any, number, number>
  };
  color?: {
    colorDim: number[]
    colorScale: ScaleContinuous<any, string>
  };
  key: string
  legend: LegendValid
  bounds?: Size
  flipped?: boolean
}

export type SeriesPointValid = Omit<SeriesPointArgs, 'radiuses'> & {
  radiuses: number | {
    radiusDim: number[],
    scale: ScaleAny<any, number, number>
  };
}

export function seriesPointData(data: SeriesPointArgs): SeriesPointValid {
  const {x, y, radiuses, key, legend} = data
  //TODO: Do clean radius validation
  const radiusesValid = typeof radiuses === "number" ? radiuses : typeof radiuses === "object" ? {
    scale: radiuses.scale,
    radiusDim: radiuses.radiusDim
  } : 5

  return {x, y,
    radiuses: radiusesValid,
    color: data.color,
    legend,
    key,
    bounds: data.bounds || { width: 600, height: 400 },
    flipped: data.flipped || false,
    ...seriesConfigTooltipsData(data), //TODO: fix tooltips for all charts
  };
}

export function seriesPointCreatePoints(seriesData: SeriesPointValid): Point[] {
  const { x, y, radiuses, bounds,
    legend, key: seriesKey, flipped,
    color } = seriesData;

  const data: Point[] = [];

  for (let i = 0; i < x.values.length; ++i) {
    const xVal = x.values[i]
    const yVal = y.values[i]
    const category = x.categories[i]
    const r = typeof radiuses === "number" ? radiuses : radiuses.scale(radiuses.radiusDim[i]);
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
      radiusValue: typeof radiuses !== "number" ? radiuses.radiusDim[i] : undefined
    });
  }

  return data;
}

