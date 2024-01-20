import {Selection} from 'd3';
import {AxisUserArgs, AxisValid, axisValidation, syncAxes} from "../../axis";
import {ChartBaseArgs, ChartBaseValid, chartBaseValidation} from "../chart-base";
import {validateZoom, ZoomArgs, ZoomValid} from "../../../data/zoom";
import {LegendArgsUser, legendValidation, LegendValid} from "../../legend";
import {RespValByValueOptional} from "../../../data/responsive-value/responsive-value-value";

export type ChartCartesianArgs = ChartBaseArgs & {
  x: AxisUserArgs
  y: AxisUserArgs
  flipped?: RespValByValueOptional<boolean>
  zoom?: ZoomArgs
  styleClasses?: string[]
  legend?: LegendArgsUser
}

export type ChartCartesianValid = ChartBaseValid & {
  x: AxisValid
  y: AxisValid
  flipped: RespValByValueOptional<boolean>
  zoom?: ZoomValid
  legend: LegendValid
}

export function chartCartesianValidation(data: ChartCartesianArgs): ChartCartesianValid {
  const {
    legend, flipped, zoom, renderer
  } = data
  const [x, y] = syncAxes(axisValidation({...data.x, renderer}), axisValidation({...data.y, renderer}))
  const categoriesOrdered = Object.keys(x.categoryOrder)
  const legendValid = legendValidation({
    ...(legend ? legend : {}),
    renderer: data.renderer,
    categories: categoriesOrdered,
  })

  return {
    flipped: flipped || false,
    x,
    y,
    ...chartBaseValidation(data),
    legend: legendValid,
    zoom: zoom ? validateZoom(zoom) : undefined
  };
}

export type ChartCartesianSelection = Selection<SVGSVGElement | SVGGElement, ChartCartesianValid>;

