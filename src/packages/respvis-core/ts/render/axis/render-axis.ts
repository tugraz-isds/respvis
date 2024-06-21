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
import {Axis} from "./validate-base-axis";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";
import {modifyAxisTicksPostGeneration, renderAxisTicksPreGeneration} from "./render-axis-ticks";
import {configureTickAngles} from "./configure-tick-angle";
import {getFilteredScaledValues} from "../../data/scale/validate-scaled-values-axis";
import {renderBgSVGOnlyBBox} from "../bg-svg-only";
import {AxisLayouts, Orientation} from "../../constants/types";
import {KeyedAxis} from "respvis-parcoord/render/validate-keyed-axis";

export type AxisSelection = Selection<SVGSVGElement | SVGGElement, Axis>;
export type KeyedAxisSelection = Selection<SVGSVGElement | SVGGElement, KeyedAxis>;
export type AxisTransition = Transition<SVGSVGElement | SVGGElement, Axis>;

export function renderAxisLayout(axisS: AxisSelection, orientation: Orientation = 'horizontal') {
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
  return renderAxis(axisS, d3Axis(generators[layout], axisS))
}

function resetTickLines(axisS: AxisSelection) {
  const tickLinesS = axisS.selectAll('.tick > line');
  ['x1', 'x2', 'y1', 'y2']
    .forEach(attr => tickLinesS.attr(attr, null))
}

export function renderAxisSequence(axisS: KeyedAxisSelection, orientation: Orientation) {
  renderBgSVGOnlyBBox(axisS)
  renderAxisLayout(axisS, orientation)
  axisS.classed('axis-sequence', true)
  axisS.selectAll('.title-wrapper')
    .classed('layout-container', true)
  return axisS.attr('data-key', (d) => d.key)
}

function renderAxis(axisS: AxisSelection, a: D3Axis<AxisDomain>): void {
  const axisD = axisS.datum()
  const axisElement = elementFromSelection(axisS)
  const chartS = axisD.renderer.chartS

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
    .text(getCurrentRespVal(axisD.title, {chart: chartS, self: axisS}))

  titleWrapperS.selectAll('.subtitle')
    .data(axisD.subTitle ? [null] : [])
    .join('g')
    .classed('subtitle', true)
    .selectAll('text')
    .data([null])
    .join('text')
    .text(getCurrentRespVal(axisD.subTitle, {chart: chartS, self: axisS}))

  const ticksS = renderAxisTicksPreGeneration(axisS)
  a(ticksS);
  modifyAxisTicksPostGeneration(ticksS)
  axisD.breakpoints.updateCSSVars(axisElement)
  configureTickAngles(axisS, ticksS)
}

function d3Axis(
  axisGenerator: (scale: AxisScale<AxisDomain>) => D3Axis<AxisDomain>,
  axisS: AxisSelection
): D3Axis<AxisDomain> {
  const {scaledValues, breakpoints, configureAxis, renderer} = axisS.datum()
  const axisElement = elementFromSelection(axisS)

  breakpoints.updateCSSVars(axisElement)

  const configureAxisValid = getCurrentRespVal(configureAxis,
    {chart: renderer.chartS, self: axisS
    })

  const filteredScaledValues = getFilteredScaledValues(scaledValues)

  const axis = axisGenerator(filteredScaledValues.scale)
  configureAxisValid(axis)
  axisS.datum().d3Axis = axis
  axisS.datum().originalAxis.d3Axis = axis
  return axis;
}
