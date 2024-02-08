import {Selection} from 'd3';
import {AxisUserArgs, AxisValid, axisValidation} from "../../axis";
import {ChartBaseArgs, ChartBaseValid, chartBaseValidation} from "../chart-base";
import {ZoomArgs, ZoomValid, zoomValidation} from "../../../data/zoom";
import {LegendUserArgs, LegendValid, legendValidation} from "../../legend";
import {CartesianSeries, CartesianSeriesUserArgs} from "../../cartesian-series";

export type ChartCartesianUserArgs = ChartBaseArgs & {
  series: CartesianSeriesUserArgs
  // additionalSeries:
  x: AxisUserArgs
  y: AxisUserArgs
  legend?: LegendUserArgs
  zoom?: ZoomArgs
}

export type ChartCartesianArgs = Omit<ChartCartesianUserArgs, 'series'> & {
  series: CartesianSeries
}

export type ChartCartesianValid = ChartBaseValid & {
  series: CartesianSeries
  x: AxisValid
  y: AxisValid
  legend: LegendValid
  zoom?: ZoomValid
}

export type ChartCartesianSelection = Selection<SVGSVGElement | SVGGElement, ChartCartesianValid>

export function chartCartesianValidation(cartesianArgs: ChartCartesianArgs): ChartCartesianValid {
  const {renderer, series,x, y,
    zoom} = cartesianArgs
  return {
    series,
    x: axisValidation({...x, renderer, scaledValues: series.x}),
    y: axisValidation({...y, renderer, scaledValues: series.y}),
    legend: legendValidation({...cartesianArgs.legend, renderer, series}),
    ...chartBaseValidation(cartesianArgs),
    zoom: zoom ? zoomValidation(zoom) : undefined
  };
}
