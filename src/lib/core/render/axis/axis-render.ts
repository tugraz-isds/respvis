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
import {AxisValid} from "./base-axis-validation";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";
import {axisTicksPostGenerationRender, axisTicksPreGenerationRender} from "./axis-ticks-render";
import {tickAngleConfiguration} from "./tick-angle-configuration";
import {getFilteredScaledValues} from "../../data/scale/axis-scaled-values-validation";
import {bgSVGOnlyBBoxRender} from "../util/bg-svg-only-render";
import {AxisLayout} from "../../constants/types";
import {KeyedAxisValid} from "./keyed-axis-validation";

export type AxisSelection = Selection<SVGSVGElement | SVGGElement, AxisValid>;
export type KeyedAxisSelection = Selection<SVGSVGElement | SVGGElement, KeyedAxisValid>;
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

export function axisSequenceRender(axisS: KeyedAxisSelection, axisPosition?: AxisLayout) {
  bgSVGOnlyBBoxRender(axisS)
  axisS.classed('axis-bottom', false)
  axisS.classed('axis-left', false)
  axisS.classed('axis-right', false)
  axisS.classed('axis-top', false)
  switch (axisPosition) {
    case "bottom": axisBottomRender(axisS); break;
    default: axisLeftRender(axisS)
  }
  axisS.classed('axis-sequence', true)
  axisS.selectAll('.title-wrapper')
    .classed('layout-container', true)

  return axisS.attr('data-key', (d) => d.key)
}

function axisRender(axisS: AxisSelection, a: D3Axis<AxisDomain>): void {
  const axisD = axisS.datum()
  const axisElement = elementFromSelection(axisS)
  const chartElement = elementFromSelection(axisD.renderer.chartS)

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
    .selectAll('text')
    .data([null])
    .join('text')
    .text(getCurrentRespVal(axisD.title, {chart: chartElement, self: axisElement}))

  titleWrapperS.selectAll('.subtitle')
    .data([null])
    .join('g')
    .classed('subtitle', true)
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
  const chartElement = elementFromSelection(renderer.chartS)
  const configureAxisValid = getCurrentRespVal(configureAxis, {chart: chartElement, self: axisElement})

  const filteredScaledValues = getFilteredScaledValues(scaledValues)

  const axis = axisGenerator(filteredScaledValues.scale)
  configureAxisValid(axis)
  selection.datum().d3Axis = axis
  selection.datum().originalAxis.d3Axis = axis
  return axis;
}
