import {Selection} from 'd3';
import {AxisBaseUserArgs, axisBaseValidation, AxisValid} from "../../axis";
import {chartValidation} from "../chart";
import {legendValidation} from "../../legend";
import {CartesianSeries, CartesianSeriesUserArgs} from "../../series/cartesian-series";
import {SeriesChartUserArgs, SeriesChartValid} from "../series-chart/series-chart-validation";

export type CartesianChartUserArgs = SeriesChartUserArgs & {
  series: CartesianSeriesUserArgs
  // additionalSeries:
  x: AxisBaseUserArgs
  y: AxisBaseUserArgs
}

export type CartesianChartArgs = Omit<CartesianChartUserArgs, 'series'> & {
  series: CartesianSeries
}

export type CartesianChartValid = SeriesChartValid & {
  series: CartesianSeries
  x: AxisValid
  y: AxisValid
}

export type CartesianChartSelection = Selection<SVGSVGElement | SVGGElement, CartesianChartValid>

export function cartesianChartValidation(cartesianArgs: CartesianChartArgs): CartesianChartValid {
  const {renderer, series, x, y} = cartesianArgs

  return {
    series,
    x: axisBaseValidation({...x, renderer, scaledValues: series.x}),
    y: axisBaseValidation({...y, renderer, scaledValues: series.y}),
    getAxes: function () { return [this.x, this.y] },
    getSeries: function () { return [this.series] },
    getMainSeries: function () { return this.series },
    legend: legendValidation({...cartesianArgs.legend, renderer, series}),
    ...chartValidation(cartesianArgs),
  }
}
