import {SeriesConfigTooltips, seriesConfigTooltipsData,} from '../tooltip';
import {AxisValid, Circle, ScaleContinuous, Size} from '../core';
import {LegendValid} from "../legend";
import {getRadiusDefinite, isRadiusVaryingArg, RadiusArg} from "../core/utilities/radius/radius-dimension";

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
  radii?: RadiusArg
  color?: {
    colorDim: number[]
    colorScale: ScaleContinuous<any, string>
  };
  key: string
  legend: LegendValid
  bounds?: Size
  flipped?: boolean
}

export type SeriesPointValid = Required<Omit<SeriesPointArgs, 'color'>> & {
  color?: {
    colorDim: number[]
    colorScale: ScaleContinuous<any, string>
  };
}

export function seriesPointData(data: SeriesPointArgs): SeriesPointValid {
  const {x, y, radii, key, legend} = data
  //TODO: Do clean radius validation
  const radiusesValid = typeof radii === "number" ? radii :
    isRadiusVaryingArg(radii) ? radii : 5

  return {x, y,
    radii: radiusesValid,
    color: data.color,
    legend,
    key,
    bounds: data.bounds || { width: 600, height: 400 },
    flipped: data.flipped || false,
    ...seriesConfigTooltipsData(data), //TODO: fix tooltips for all charts
  };
}

export function seriesPointCreatePoints(seriesData: SeriesPointValid): Point[] {
  const { x, y, radii, bounds,
    legend, key: seriesKey, flipped,
    color } = seriesData

  const data: Point[] = []
  //TODO: Find a good solution for this quick dirty hack!!!!
  const chartElement = document.getElementsByClassName('chart-point')[0] as SVGSVGElement
  const radiusDefinite = getRadiusDefinite(radii, {chart: chartElement})

  for (let i = 0; i < x.values.length; ++i) {
    const xVal = x.values[i]
    const yVal = y.values[i]
    const category = x.categories[i]
    const r = typeof radiusDefinite === "number" ? radiusDefinite : radiusDefinite.scale(radiusDefinite.values[i])
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
      radiusValue: typeof radii !== "number" ? radii.values[i] : undefined
    });
  }

  return data;
}

