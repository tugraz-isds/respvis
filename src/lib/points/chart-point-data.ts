import {ChartCartesianArgs, chartCartesianData, ChartCartesianValid, ScaleContinuous} from "../core";
import {seriesPointData, SeriesPointValid} from "./series-point-validation";
import {RadiusArg} from "../core/utilities/radius/radius-dimension";

// type Dimension = number | string // TODO: | date . Include this everywhere

export type ChartPointArgs = ChartCartesianArgs & {
  radii?: RadiusArg
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  }
}

export type ChartPointData = ChartCartesianValid & {
  pointSeries: SeriesPointValid;
}

export function chartPointData(data: ChartPointArgs): ChartPointData {
  const {radii , color} = data

  const { x, y, markerTooltips,
    legend, flipped, ...restCartesian } = chartCartesianData(data)

  const pointSeries = seriesPointData({
    ...(markerTooltips ?? {}),
    flipped, x, y, color, radii, legend, key: '0'
  })

  return {
    x,
    y,
    flipped,
    legend,
    pointSeries,
    ...restCartesian,
    markerTooltips,
  }
}
