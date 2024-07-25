import {CartesianChartData, CartesianChartUserArgs, CartesianRenderer, validateCartesianChart} from "respvis-cartesian";
import {BarSeries, BarSeriesUserArgs} from "../bar-series/bar-series";
import {BarStackedSeries} from "../bar-series/bar-stacked/bar-stacked-series";
import {BarGroupedSeries} from "../bar-series/bar-grouped/bar-grouped-series";
import {BarStandardSeries} from "../bar-series";

export type BarChartUserArgs = Omit<CartesianChartUserArgs, 'series'> & {
  series: BarSeriesUserArgs
}

export type BarChartArgs = BarChartUserArgs & {
  renderer: CartesianRenderer
}

export type BarChartData = Omit<CartesianChartData, 'series'> & {
  series: BarSeries
}

export function validateBarChart(args: BarChartArgs): BarChartData {
  const {renderer, x, y,
    legend, breakpoints,
    title, subTitle
  } = args
  const series = args.series.type === 'stacked' ?
    new BarStackedSeries({...args.series, key: 's-0', renderer}) : args.series.type === 'grouped' ?
    new BarGroupedSeries({...args.series, key: 's-0', renderer}) :
    new BarStandardSeries({...args.series, key: 's-0', renderer})
  const cartesianData =
    validateCartesianChart({renderer, series, x, y, legend, breakpoints, title, subTitle})
  return {
    ...cartesianData,
    series
  }
}
