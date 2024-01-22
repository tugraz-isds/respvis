import {ChartCartesianUserArgs, ChartCartesianValid, chartCartesianValidation, ScaleContinuous} from "../../core";
import {SeriesPointUserArgs, SeriesPointValid, seriesPointValidation} from "../point-series/point-series-validation";

export type ScatterPlotArgs = Omit<ChartCartesianUserArgs, 'series'> & {
  series: SeriesPointUserArgs
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  }
}

export type ChartPointValid = ChartCartesianValid & {
  pointSeries: SeriesPointValid;
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  }
}

//TODO: Check if done correctly for all charts
//1. Series Data
//1. Base Data
//3. Series Data -> Axis Data
//3. Series Data -> Legend Data

export function scatterPlotValidation(scatterArgs: ScatterPlotArgs): ChartPointValid {
  const {renderer, x, y, color, zoom,
    legend, bounds,
    flipped, title, subTitle
  } = scatterArgs
  const series = seriesPointValidation({...scatterArgs.series, key: '0', renderer})
  const cartesianData =
    chartCartesianValidation({renderer, series, x, y, zoom, legend, bounds, flipped, title, subTitle})

  return {
    pointSeries: series,
    ...cartesianData,
    color
  }
}
