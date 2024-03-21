import {
  Axis as D3Axis,
  axisBottom as d3AxisBottom,
  AxisDomain,
  axisLeft as d3AxisLeft,
  AxisScale,
  Selection,
  Transition
} from "d3";
import {elementFromSelection} from "../../utilities/d3/util";
import {updateBreakpointStatesInCSS} from "../../data";
import {AxisValid} from "./axis-base-validation";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";
import {axisTicksPostGenerationRender, axisTicksPreGenerationRender} from "./axis-ticks-render";
import {tickAngleConfiguration} from "./tick-angle-configuration";
import {getFilteredScaledValues} from "../../data/scale/axis-scaled-values-validation";
import {backgrounSVGOnlyRender} from "../util/bg-svg-only-render";

export type AxisSelection = Selection<SVGSVGElement | SVGGElement, AxisValid>;
export type AxisTransition = Transition<SVGSVGElement | SVGGElement, AxisValid>;

export function axisLeftRender(axisS: AxisSelection) {
  // console.log(axisS)
  axisS.classed('axis axis-left', true)
  return axisRender(axisS, d3Axis(d3AxisLeft, axisS))
}

export function axisBottomRender(axisS: AxisSelection) {
  axisS.classed('axis axis-bottom', true)
  return axisRender(axisS, d3Axis(d3AxisBottom, axisS))
}

export function axisSequenceRender(axisS: AxisSelection) {
  backgrounSVGOnlyRender(axisS)
  axisS.classed('axis axis-sequence', true)
  return axisRender(axisS, d3Axis(d3AxisLeft, axisS))
}

function axisRender(axisS: AxisSelection, a: D3Axis<AxisDomain>): void {
  const axisD = axisS.datum()
  const axisElement = elementFromSelection(axisS)
  const chartElement = elementFromSelection(axisD.renderer.chartSelection)

  const titleWrapperS = axisS
    .selectAll('.title-wrapper')
    .data([null])
    .join('g')
    .classed('title-wrapper', true)

  titleWrapperS
    .selectAll('.title')
    .data([null])
    .join('g')
    .classed('title', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data([null])
    .join('text')
    .text(getCurrentRespVal(axisD.title, {chart: chartElement, self: axisElement}))

  titleWrapperS.selectAll('.subtitle')
    .data([null])
    .join('g')
    .classed('subtitle', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data([null])
    .join('text')
    .text(getCurrentRespVal(axisD.subTitle, {chart: chartElement, self: axisElement}))

  const ticksS = axisTicksPreGenerationRender(axisS)
  a(ticksS);
  axisTicksPostGenerationRender(ticksS)
  updateBreakpointStatesInCSS(axisElement, axisD.bounds)
  tickAngleConfiguration(axisS, ticksS)
}

function d3Axis(
  axisGenerator: (scale: AxisScale<AxisDomain>) => D3Axis<AxisDomain>,
  selection: AxisSelection
): D3Axis<AxisDomain> {
  const {scaledValues, bounds, configureAxis, renderer} = selection.datum()
  const axisElement = elementFromSelection(selection)
  updateBreakpointStatesInCSS(axisElement, bounds)
  const chartElement = elementFromSelection(renderer.chartSelection)
  const configureAxisValid = getCurrentRespVal(configureAxis, {chart: chartElement, self: axisElement})

  const filteredScaledValues = getFilteredScaledValues(scaledValues)

  const axis = axisGenerator(filteredScaledValues.scale)
  configureAxisValid(axis)
  return axis;
}
