import {Selection} from 'd3';
import {SeriesChartArgs, SeriesChartData, SeriesChartUserArgs, validateChart, validateLegend} from "respvis-core";
import {CartesianSeries, CartesianSeriesUserArgs} from "../cartesian-series";
import {CartesianAxis, CartesianAxisUserArgs, validateCartesianAxis} from "../validate-cartesian-axis";

export type CartesianChartUserArgs = SeriesChartUserArgs & {
  series: CartesianSeriesUserArgs
  // additionalSeries:
  x?: CartesianAxisUserArgs
  y?: CartesianAxisUserArgs
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

export function validateCartesianChart(args: CartesianChartArgs): CartesianChartData {
  const {renderer, series, x, y} = args
  return {
    series,
    x: validateCartesianAxis({...(x ?? {}), renderer, scaledValues: series.x, series, key: 0}),
    y: validateCartesianAxis({...(y ?? {}), renderer, scaledValues: series.y, series, key: 1}),
    getAxes: function (this:CartesianChartData) {
      return [this.x, this.y, ...(this.series.color ? [this.series.color.axis] : [])]
    },
    getSeries: function (this:CartesianChartData) { return [this.series] },
    getMainSeries: function (this:CartesianChartData) { return this.series },
    legend: validateLegend({...args.legend, renderer, series}),
    ...validateChart(args),
  }
}
