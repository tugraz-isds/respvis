import {
  calcDefaultScale,
  IChartCartesianData,
  chartCartesianData,
  ScaleAny,
  ScaleContinuous,
  AxisData,
  TickOrientation, ConfigureAxisFn, AxisArgs, axisData
} from "../core";
import {Legend, legendData} from "../legend";
import {Point, SeriesPoint, seriesPointData} from "./series-point";
import {zoom, ZoomBehavior} from "d3";
import {BoundArg, Bounds} from "../core/utilities/resizing/types";
import {SeriesConfigTooltips} from "../tooltip";

// type Dimension = number | string // TODO: | date . Include this everywhere

export type ChartPointArgs = {
  x: AxisArgs,
  y: AxisArgs,
  radiuses?: number | {
    radiusDim: number[][],
    scale: ScaleAny<any, number, number>
  }
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  }
  zoom?: {
    in: number,
    out: number
  };
  styleClasses?: string[]
  legend?: Legend
  flipped?: boolean;
  title?: string;
  subtitle?: string;
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>;
}

export type ChartPointData = {
  x: AxisData,
  y: AxisData,
  pointSeries: SeriesPoint[];
  maxRadius: number
  zoom?: {
    behaviour:  ZoomBehavior<Element, unknown>
    in: number,
    out: number
  }
  legend: Legend;

  xAxis?: Partial<AxisData>;
  yAxis?: Partial<AxisData>;
  flipped?: boolean;
  title?: string;
  subtitle?: string;
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>;
}

export function chartPointData(data: ChartPointArgs): ChartPointData {
  const {x, y,
    legend, flipped, radiuses, zoom : zoomData,
    color} = data
  const {values: xValues, scale: xScale} = x
  const {values: yValues, scale: yScale} = y
  const lowerLength = xValues.length < yValues.length ? xValues.length : yValues.length
  const xVals = xValues.slice(0, lowerLength)
  const yVals = yValues.slice(0, lowerLength)
  const xScaleValid = xScale ?? calcDefaultScale(xValues)
  const yScaleValid = yScale ?? calcDefaultScale(yValues)

  const points = xVals.map((xVal, index) => {
    const styleClasses = data.styleClasses ? data.styleClasses[index] : `categorical-${index}`
    const radiusesValid = typeof radiuses === "number" ? radiuses : typeof radiuses === "object" ? {
      scale: radiuses.scale,
      radiusDim: radiuses.radiusDim[index]
    } : 5
    const toolTipData = data.markerTooltips || {}
    return seriesPointData({
      flipped, styleClasses,
      keys: yVals[index].map((_, markerI) => `${legend?.keys?.[index] ?? index}-${markerI}`),
      xValues: xVals[index],
      yValues: yVals[index],
      radiuses: radiusesValid,
      color,
      xScale: xScaleValid,
      yScale: yScaleValid,
      ...toolTipData,
    })
  })
  const firstPoint = points[0]
  const maxRadius = typeof firstPoint.radiuses === "number" ? firstPoint.radiuses : firstPoint.radiuses.scale.range()[1]

  const labels = legend?.labels ? legend.labels : yVals.map((yVal, index) => `categorical-${index}`)
  //TODO: make zoom optional

  return {
    x: {...axisData(x),
      scale: xScaleValid
    },
    y: {...axisData(y),
      scale: yScaleValid
    },
    pointSeries: points,
    maxRadius,
    legend: legendData(legend ? legend : { labels }),
    title: data.title || '',
    subtitle: data.subtitle || '',
    flipped: data.flipped || false,
    zoom: zoomData ? {
      ...zoomData,
      behaviour: zoom()
    } : undefined
  };
}
