import {ChartCartesianUserArgs, ChartCartesianValid, chartCartesianValidation} from "../../core";
import {SeriesPointUserArgs, SeriesPointValid, seriesPointValidation} from "../point-series/point-series-validation";

export type ScatterPlotArgs = Omit<ChartCartesianUserArgs, 'series'> & {
  series: SeriesPointUserArgs
}

export type ChartPointValid = ChartCartesianValid & {
  series: SeriesPointValid;
}

export function scatterPlotValidation(scatterArgs: ScatterPlotArgs): ChartPointValid {
  const {renderer, x, y, zoom,
    legend, bounds,
    title, subTitle
  } = scatterArgs
  const series = seriesPointValidation({...scatterArgs.series, key: 's-0', renderer})
  const cartesianData =
    chartCartesianValidation({renderer, series, x, y, zoom, legend, bounds, title, subTitle})

  return {
    ...cartesianData,
    series,
  }
}
