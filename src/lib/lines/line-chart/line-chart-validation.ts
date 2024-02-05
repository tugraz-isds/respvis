import {ChartCartesianUserArgs, ChartCartesianValid, chartCartesianValidation} from "../../core";
import {LineSeries, LineSeriesUserArgs, lineSeriesValidation} from "../line-series/line-series-validation";

export type LineChartArgs = Omit<ChartCartesianUserArgs, 'series'> & {
  series: LineSeriesUserArgs
}

export type LineChartValid = ChartCartesianValid & {
  series: LineSeries;
}

export function lineChartValidation(lineArgs: LineChartArgs): LineChartValid {
  const {renderer, x, y, zoom,
    legend, bounds,
    title, subTitle
  } = lineArgs
  const series = lineSeriesValidation({...lineArgs.series, key: 's-0', renderer})
  const cartesianData =
    chartCartesianValidation({renderer, series, x, y, zoom, legend, bounds, title, subTitle})

  return {
    ...cartesianData,
    series,
  }
}
