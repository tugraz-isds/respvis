import {Selection} from 'd3';
import {AxisUserArgs, AxisValid, axisValidation, syncAxes} from "../../axis";
import {ChartBaseArgs, ChartBaseValid, chartBaseValidation} from "../chart-base";
import {validateZoom, ZoomArgs, ZoomValid} from "../../../data/zoom";
import {LegendArgsUser, legendData, LegendValid} from "../../legend";

export type ChartCartesianArgs = ChartBaseArgs & {
  x: AxisUserArgs
  y: AxisUserArgs
  flipped?: boolean
  zoom?: ZoomArgs
  styleClasses?: string[]
  legend?: LegendArgsUser
}

export type ChartCartesianValid = ChartBaseValid & {
  x: AxisValid
  y: AxisValid
  flipped: boolean
  zoom?: ZoomValid
  legend: LegendValid
}

export function chartCartesianData(data: ChartCartesianArgs): ChartCartesianValid {
  const {
    legend, flipped, zoom, renderer
  } = data
  const [x, y] = syncAxes(axisValidation({...data.x, renderer}), axisValidation({...data.y, renderer}))
  const categoriesOrdered = Object.keys(x.categoryOrder)
  const legendValid = legendData({
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

