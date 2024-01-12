import {ChartCartesianArgs, chartCartesianData, ChartCartesianValid, ScaleAny, ScaleContinuous} from "../core";
import {seriesPointData, SeriesPointValid} from "./series-point-validation";

// type Dimension = number | string // TODO: | date . Include this everywhere

export type ChartPointArgs = ChartCartesianArgs & {
  radiuses?: number | {
    radiusDim: number[],
    scale: ScaleAny<any, number, number>
  }
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  }
}

export type ChartPointData = ChartCartesianValid & {
  pointSeries: SeriesPointValid;
  maxRadius: number
}

export function chartPointData(data: ChartPointArgs): ChartPointData {
  const {radiuses , color} = data

  const {x, y, markerTooltips,
    legend, flipped, ...restCartesian} = chartCartesianData(data)

  const pointSeries = seriesPointData({
    ...(markerTooltips ?? {}),
    flipped, x, y, color, radiuses, legend, key: '0'
  })

  const maxRadius = typeof pointSeries.radiuses === "number" ? pointSeries.radiuses : pointSeries.radiuses.scale.range()[1]
  return {
    x,
    y,
    flipped,
    legend,
    pointSeries,
    maxRadius,
    ...restCartesian,
    markerTooltips,
  };
}
