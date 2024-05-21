import {Selection} from 'd3';
import {legendValidation, SeriesChartArgs, SeriesChartData, SeriesChartUserArgs, validateChart} from "respvis-core";
import {CartesianSeries, CartesianSeriesUserArgs} from "../cartesian-series";
import {CartesianAxis, CartesianAxisUserArgs, validateCartesianAxis} from "../cartesian-axis-validation";

export type CartesianChartUserArgs = SeriesChartUserArgs & {
  series: CartesianSeriesUserArgs
  // additionalSeries:
  x: CartesianAxisUserArgs
  y: CartesianAxisUserArgs
}

export type CartesianChartArgs = SeriesChartArgs & Omit<CartesianChartUserArgs, 'series'> & {
  series: CartesianSeries
}

export type CartesianChartData = SeriesChartData & {
  series: CartesianSeries
  x: CartesianAxis
  y: CartesianAxis
}

export type CartesianChartSelection = Selection<SVGSVGElement | SVGGElement, CartesianChartData>

export function cartesianChartValidation(args: CartesianChartArgs): CartesianChartData {
  const {renderer, series, x, y} = args

  return {
    series,
    x: validateCartesianAxis({...x, renderer, scaledValues: series.x, series}),
    y: validateCartesianAxis({...y, renderer, scaledValues: series.y, series}),
    getAxes: function () { return [this.x, this.y] },
    getSeries: function () { return [this.series] },
    getMainSeries: function () { return this.series },
    legend: legendValidation({...args.legend, renderer, series}),
    ...validateChart(args),
  }
}
