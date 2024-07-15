import {
  CartesianChartData,
  CartesianChartUserArgs,
  prepareCartesianSeriesArgs,
  validateCartesianChart
} from "respvis-cartesian";
import {LineSeries, LineSeriesUserArgs} from "../line-series/line-series-validation";
import {RenderArgs} from "respvis-core";

export type LineChartUserArgs =  Omit<CartesianChartUserArgs, 'series'> & {
  series: LineSeriesUserArgs
}

export type LineChartArgs = LineChartUserArgs & RenderArgs

export type LineChartData = CartesianChartData & {
  series: LineSeries;
}

export function validateLineChart(args: LineChartArgs): LineChartData {
  const {renderer, x, y,
    legend, breakpoints,
    title, subTitle
  } = args

  const series = new LineSeries(prepareCartesianSeriesArgs({...args.series, renderer}))

  const cartesianData =
    validateCartesianChart({renderer, series, x, y, legend, breakpoints, title, subTitle})

  return {
    ...cartesianData,
    series,
  }
}
