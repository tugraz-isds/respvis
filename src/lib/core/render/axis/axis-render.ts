import {
  Axis as D3Axis,
  axisBottom as d3AxisBottom,
  AxisDomain,
  axisLeft as d3AxisLeft,
  axisRight as d3AxisRight,
  AxisScale,
  axisTop as d3AxisTop,
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
import {AxisLayouts, Orientation} from "../../constants/types";
import {KeyedAxisValid} from "./keyed-axis-validation";

export type AxisSelection = Selection<SVGSVGElement | SVGGElement, AxisValid>;
export type KeyedAxisSelection = Selection<SVGSVGElement | SVGGElement, KeyedAxisValid>;
export type AxisTransition = Transition<SVGSVGElement | SVGGElement, AxisValid>;

function resetTickLines(axisS: AxisSelection) {
  const tickLinesS = axisS.selectAll('.tick > line');
  ['x1', 'x2', 'y1', 'y2']
    .forEach(attr => tickLinesS.attr(attr, null))
}

export function axisLayoutRender(axisS: AxisSelection, orientation: Orientation = 'horizontal') {
  resetTickLines(axisS)
  const { horizontalLayout, verticalLayout} = axisS.datum()
  const layout = orientation === 'horizontal' ? horizontalLayout : verticalLayout
  const generators = {
    'left': d3AxisLeft,
    'right': d3AxisRight,
    'bottom': d3AxisBottom,
    'top': d3AxisTop,
  } as const
  axisS.classed(`axis axis-${layout}`, true)
  const unusedLayouts = AxisLayouts.filter(axisLayout => axisLayout !== layout)
  unusedLayouts.forEach(unusedLayout => axisS.classed(`axis-${unusedLayout}`, false))
  return axisRender(axisS, d3Axis(generators[layout], axisS))
}

export function axisSequenceRender(axisS: KeyedAxisSelection, orientation: Orientation) {
  bgSVGOnlyBBoxRender(axisS)
  axisLayoutRender(axisS, orientation)
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
  updateBreakpointStatesInCSS(axisElement, axisD.breakPoints)
  tickAngleConfiguration(axisS, ticksS)
}

function d3Axis(
  axisGenerator: (scale: AxisScale<AxisDomain>) => D3Axis<AxisDomain>,
  selection: AxisSelection
): D3Axis<AxisDomain> {
  const {scaledValues, breakPoints, configureAxis, renderer} = selection.datum()
  const axisElement = elementFromSelection(selection)
  updateBreakpointStatesInCSS(axisElement, breakPoints)
  const chartElement = elementFromSelection(renderer.chartS)
  const configureAxisValid = getCurrentRespVal(configureAxis, {chart: chartElement, self: axisElement})

  const filteredScaledValues = getFilteredScaledValues(scaledValues)

  const axis = axisGenerator(filteredScaledValues.scale)
  configureAxisValid(axis)
  selection.datum().d3Axis = axis
  selection.datum().originalAxis.d3Axis = axis
  return axis;
}
