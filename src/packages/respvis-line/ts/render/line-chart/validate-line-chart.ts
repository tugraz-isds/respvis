import {CartesianChartData, CartesianChartUserArgs, CartesianRenderer, validateCartesianChart} from "respvis-cartesian";
import {LineSeries, LineSeriesUserArgs} from "../line-series/line-series";

export type LineChartUserArgs =  Omit<CartesianChartUserArgs, 'series'> & {
  series: LineSeriesUserArgs
}

export type LineChartArgs = LineChartUserArgs & {
  renderer: CartesianRenderer
}

export type LineChartData = Omit<CartesianChartData, 'series'> & {
  series: LineSeries;
}

export function validateLineChart(args: LineChartArgs): LineChartData {
  const {renderer, x, y,
    legend, breakpoints,
    title, subTitle
  } = args
  const series = new LineSeries({...args.series, key: 's-0', renderer})
  const cartesianData =
    validateCartesianChart({renderer, series, x, y, legend, breakpoints, title, subTitle})

  return {
    ...cartesianData,
    series,
  }
}
