import {ChartCartesianArgs, chartCartesianData, ChartCartesianValid, ScaleContinuous} from "../../core";
import {seriesPointData, SeriesPointValid} from "../point-series/point-series-validation";
import {RadiusArg} from "../../core/data/radius/radius-validation";

// type Dimension = number | string // TODO: | date . Include this everywhere

export type ChartPointArgs = ChartCartesianArgs & {
  radii?: RadiusArg
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  }
}

export type ChartPointValid = ChartCartesianValid & {
  pointSeries: SeriesPointValid;
}

export function chartPointData(data: ChartPointArgs): ChartPointValid {
  const {radii , color} = data

  const { x, y, markerTooltips,
    legend, flipped, ...restCartesian } = chartCartesianData(data)

  const pointSeries = seriesPointData({
    ...(markerTooltips ?? {}),
    flipped, x, y, color, radii, legend, key: '0', renderer: data.renderer
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
