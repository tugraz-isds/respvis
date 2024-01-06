import {
  AxisArgs,
  axisData,
  AxisValid,
  ChartBaseArgs,
  ChartBaseValid,
  chartBaseValidation,
  ScaleAny,
  ScaleContinuous,
  syncAxes
} from "../core";
import {Legend, legendData} from "../legend";
import {seriesPointData, SeriesPointValid} from "./series-point";
import {zoom, ZoomBehavior} from "d3";

// type Dimension = number | string // TODO: | date . Include this everywhere

export type ChartPointArgs = ChartBaseArgs & {
  x: AxisArgs,
  y: AxisArgs,
  radiuses?: number | {
    radiusDim: number[],
    scale: ScaleAny<any, number, number>
  }
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  }
  zoom?: {
    in: number,
    out: number
  }
  styleClasses?: string[]
  legend?: Legend
}

export type ChartPointData = ChartBaseValid & {
  x: AxisValid,
  y: AxisValid,
  pointSeries: SeriesPointValid;
  maxRadius: number
  zoom?: {
    behaviour:  ZoomBehavior<Element, unknown>
    in: number,
    out: number
  }
  legend: Legend;
}

export function chartPointData(data: ChartPointArgs): ChartPointData {
  const {
    legend, flipped, radiuses, zoom : zoomData,
    color} = data
  const [x, y] = syncAxes(axisData(data.x), axisData(data.y))
  const toolTipData = data.markerTooltips || {}

  const pointSeries = seriesPointData({
    flipped, x, y, color, radiuses, ...toolTipData,
    styleClasses: data.styleClasses ? data.styleClasses : x.categories.map((_, index) => `categorical-${index}`),
    keys: y.values.map((_, markerI) => `${markerI}`),
  })

  const maxRadius = typeof pointSeries.radiuses === "number" ? pointSeries.radiuses : pointSeries.radiuses.scale.range()[1]
  const labels = legend?.labels ? legend.labels : y.values.map((yVal, index) => `categorical-${index}`)
  //TODO: make zoom optional

  return {
    x,
    y,
    pointSeries,
    maxRadius,
    ...chartBaseValidation(data),
    legend: legendData(legend ? legend : { labels }),
    zoom: zoomData ? {
      ...zoomData,
      behaviour: zoom()
    } : undefined
  };
}
