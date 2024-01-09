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
import {LegendValid, legendData} from "../legend";
import {seriesPointData, SeriesPointValid} from "./series-point";
import {validateZoom, ZoomArgs, ZoomValid} from "../core/utilities/zoom";

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
  zoom?: ZoomArgs
  styleClasses?: string[]
  legend?: LegendValid
}

export type ChartPointData = ChartBaseValid & {
  x: AxisValid,
  y: AxisValid,
  pointSeries: SeriesPointValid;
  maxRadius: number
  zoom?: ZoomValid
  legend: LegendValid;
}

export function chartPointData(data: ChartPointArgs): ChartPointData {
  const {
    legend, flipped, radiuses, zoom ,
    color, markerTooltips} = data
  const [x, y] = syncAxes(axisData(data.x), axisData(data.y))
  const toolTipData = markerTooltips || {}
  const styleClasses = data.styleClasses ? data.styleClasses :
    x.categories.map((category) => `categorical-${x.categoryOrder[category]}`)
  const labels = legend?.labels ? legend.labels : x.categories


  const pointSeries = seriesPointData({...toolTipData,
    flipped, x, y, color, radiuses, ...toolTipData, styleClasses, labels,
    key: '0'
  })

  const maxRadius = typeof pointSeries.radiuses === "number" ? pointSeries.radiuses : pointSeries.radiuses.scale.range()[1]
  //TODO: make zoom optional
  const categories = Object.keys(x.categoryOrder)
  const legendValid = legendData({
    ...(legend ? legend : {}),
    labels: legend?.labels ? legend.labels : categories,
    keys: categories.map((_, i) => `s-0 c-${i}`)
  })
  return {
    x,
    y,
    pointSeries,
    maxRadius,
    ...chartBaseValidation(data),
    legend: legendValid,
    zoom: zoom ? validateZoom(zoom) : undefined
  };
}
