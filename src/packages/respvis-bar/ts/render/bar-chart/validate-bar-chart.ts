import {
  CartesianChartData,
  CartesianChartUserArgs,
  prepareCartesianSeriesArgs,
  validateCartesianChart
} from "respvis-cartesian";
import {BarSeries, BarSeriesUserArgs} from "../bar-series/bar-series";
import {BarStackedSeries, BarStackedSeriesArgs} from "../bar-series/bar-stacked/bar-stacked-series";
import {BarGroupedSeries, BarGroupedSeriesArgs} from "../bar-series/bar-grouped/bar-grouped-series";
import {BarStandardSeries, BarStandardSeriesArgs} from "../bar-series";
import {ErrorMessages, RenderArgs, ScaledValuesCategorical, ScaledValuesNumeric} from "respvis-core";

export type BarChartUserArgs = Omit<CartesianChartUserArgs, 'series'> & {
  series: BarSeriesUserArgs
}

export type BarChartArgs = BarChartUserArgs & RenderArgs

export type BarChartData = CartesianChartData & {
  series: BarSeries
}

export function validateBarChart(args: BarChartArgs): BarChartData {
  const {renderer, x, y,
    legend, breakpoints,
    title, subTitle
  } = args

  const seriesArgs = prepareCartesianSeriesArgs({...args.series, renderer})

  if (!(seriesArgs.x instanceof ScaledValuesCategorical) ||
    (args.series.type === 'stacked' && !(seriesArgs.y instanceof ScaledValuesNumeric)))
    throw new Error(ErrorMessages.invalidScaledValuesCombination)

  const series = args.series.type === 'stacked' ?
    new BarStackedSeries(seriesArgs as BarStackedSeriesArgs) : args.series.type === 'grouped' ?
    new BarGroupedSeries(seriesArgs as BarGroupedSeriesArgs) :
    new BarStandardSeries(seriesArgs as BarStandardSeriesArgs)

  const cartesianData =
    validateCartesianChart({renderer, series, x, y, legend, breakpoints, title, subTitle})
  return {
    ...cartesianData,
    series
  }
}
