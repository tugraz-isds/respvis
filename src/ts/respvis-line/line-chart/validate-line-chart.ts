import {CartesianChartData, CartesianChartUserArgs, validateCartesianChart} from "respvis-cartesian";
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
    legend, breakPoints,
    title, subTitle
  } = args
  const series = new LineSeries({...args.series, key: 's-0', renderer})
  const cartesianData =
    validateCartesianChart({renderer, series, x, y, legend, breakPoints, title, subTitle})

  return {
    ...cartesianData,
    series,
  }
}
