import {Selection} from 'd3';
import {
  DataSeriesChartArgs,
  DataSeriesChartData,
  DataSeriesChartUserArgs,
  validateChart,
  validateLegend
} from "respvis-core";
import {CartesianSeries, CartesianSeriesUserArgs} from "../cartesian-series";
import {CartesianAxis, CartesianAxisUserArgs, validateCartesianAxis} from "../validate-cartesian-axis";

export type CartesianChartUserArgs = DataSeriesChartUserArgs & {
  series: CartesianSeriesUserArgs
  // additionalSeries:
  x?: CartesianAxisUserArgs
  y?: CartesianAxisUserArgs
}

export type CartesianChartArgs = DataSeriesChartArgs & Omit<CartesianChartUserArgs, 'series'> & {
  series: CartesianSeries
}

export type CartesianChartData = DataSeriesChartData & {
  series: CartesianSeries
  x: CartesianAxis
  y: CartesianAxis
}

export type CartesianChartSelection = Selection<SVGSVGElement | SVGGElement, CartesianChartData>

export function validateCartesianChart(args: CartesianChartArgs): CartesianChartData {
  const {renderer, series, x, y} = args

  return {
    series,
    x: validateCartesianAxis({...(x ?? {}), renderer, scaledValues: series.x, series}),
    y: validateCartesianAxis({...(y ?? {}), renderer, scaledValues: series.y, series}),
    getAxes: function (this:CartesianChartData) {
      return [this.x, this.y, ...(this.series.color ? [this.series.color.axis] : [])]
    },
    getSeries: function (this:CartesianChartData) { return [this.series] },
    getMainSeries: function (this:CartesianChartData) { return this.series },
    legend: validateLegend({...args.legend, renderer, series}),
    ...validateChart(args),
  }
}
