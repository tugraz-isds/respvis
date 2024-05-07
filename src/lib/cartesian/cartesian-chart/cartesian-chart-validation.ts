import {Selection} from 'd3';
import {chartValidation} from "respvis-core/render/chart/chart";
import {legendValidation} from "respvis-core/render/legend";
import {CartesianSeries, CartesianSeriesUserArgs} from "../cartesian-series";
import {SeriesChartUserArgs, SeriesChartValid} from "respvis-core/render/chart/series-chart/series-chart-validation";
import {CartesianAxisUserArgs, CartesianAxisValid, cartesianAxisValidation} from "../cartesian-axis-validation";

export type CartesianChartUserArgs = SeriesChartUserArgs & {
  series: CartesianSeriesUserArgs
  // additionalSeries:
  x: CartesianAxisUserArgs
  y: CartesianAxisUserArgs
}

export type CartesianChartArgs = Omit<CartesianChartUserArgs, 'series'> & {
  series: CartesianSeries
}

export type CartesianChartValid = SeriesChartValid & {
  series: CartesianSeries
  x: CartesianAxisValid
  y: CartesianAxisValid
}

export type CartesianChartSelection = Selection<SVGSVGElement | SVGGElement, CartesianChartValid>

export function cartesianChartValidation(cartesianArgs: CartesianChartArgs): CartesianChartValid {
  const {renderer, series, x, y} = cartesianArgs

  return {
    series,
    x: cartesianAxisValidation({...x, renderer, scaledValues: series.x, series}),
    y: cartesianAxisValidation({...y, renderer, scaledValues: series.y, series}),
    getAxes: function () { return [this.x, this.y] },
    getSeries: function () { return [this.series] },
    getMainSeries: function () { return this.series },
    legend: legendValidation({...cartesianArgs.legend, renderer, series}),
    ...chartValidation(cartesianArgs),
  }
}
