import {SeriesConfigTooltips, seriesConfigTooltipsData,} from '../tooltip';
import {AxisValid, Circle, ScaleContinuous, Size} from '../core';
import {LegendValid} from "../core/render/legend";
import {getRadiusDefinite} from "../core/data/radius/radius-util";
import {RenderArgs} from "../core/render/charts/renderer";
import {elementFromSelection} from "../core/utilities/d3/util";
import {isRadiusVaryingArg, RadiusArg} from "../core/data/radius/radius-validation";

export interface Point extends Circle {
  xValue: any
  yValue: any
  label: string
  radiusValue?: any
  styleClass: string
  key: string
}

export type SeriesPointArgs = Partial<SeriesConfigTooltips<SVGCircleElement, Point>> & RenderArgs & {
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
  const {x, y, radii, key, legend, renderer} = data
  //TODO: Do clean radius validation
  const radiusesValid = typeof radii === "number" ? radii :
    isRadiusVaryingArg(radii) ? radii : 5

  return {x, y,
    radii: radiusesValid,
    renderer,
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

