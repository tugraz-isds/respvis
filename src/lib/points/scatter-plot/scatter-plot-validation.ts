import {ChartCartesianUserArgs, ChartCartesianValid, chartCartesianValidation} from "../../core";
import {PointSeries, SeriesPointUserArgs, seriesPointValidation} from "../point-series/point-series-validation";

export type ScatterPlotArgs = Omit<ChartCartesianUserArgs, 'series'> & {
  series: SeriesPointUserArgs
}

export type ScatterPlotValid = ChartCartesianValid & {
  series: PointSeries;
}

export function scatterPlotValidation(scatterArgs: ScatterPlotArgs): ScatterPlotValid {
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
