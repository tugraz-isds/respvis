import {Selection} from 'd3';
import {AxisUserArgs, AxisValid, axisValidation} from "../../axis";
import {ChartBaseArgs, ChartBaseValid, chartBaseValidation} from "../chart-base";
import {validateZoom, ZoomArgs, ZoomValid} from "../../../data/zoom";
import {LegendUserArgs, LegendValid, legendValidation} from "../../legend";
import {RespValByValueOptional} from "../../../data/responsive-value/responsive-value-value";
import {SeriesUserArgs, SeriesValid} from "../../series";

export type ChartCartesianUserArgs = ChartBaseArgs & {
  series: SeriesUserArgs
  // additionalSeries:
  x: AxisUserArgs
  y: AxisUserArgs
  legend?: LegendUserArgs
  zoom?: ZoomArgs
  flipped?: RespValByValueOptional<boolean>
}

export type ChartCartesianArgs = Omit<ChartCartesianUserArgs, 'series'> & {
  series: SeriesValid
}

export type ChartCartesianValid = ChartBaseValid & {
  series: SeriesValid
  x: AxisValid
  y: AxisValid
  legend: LegendValid
  zoom?: ZoomValid
  flipped: RespValByValueOptional<boolean>
}

export type ChartCartesianSelection = Selection<SVGSVGElement | SVGGElement, ChartCartesianValid>

export function chartCartesianValidation(cartesianArgs: ChartCartesianArgs): ChartCartesianValid {
  const {renderer, series,x, y ,
    zoom, flipped} = cartesianArgs
  return {
    series,
    x: axisValidation({...x, renderer, scale: series.xScale}),
    y: axisValidation({...y, renderer, scale: series.yScale}),
    legend: legendValidation({...cartesianArgs.legend, renderer, series}),
    ...chartBaseValidation(cartesianArgs),
    zoom: zoom ? validateZoom(zoom) : undefined,
    flipped: flipped || false,
  };
}
