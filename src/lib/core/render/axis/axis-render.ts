import {
  Axis as D3Axis,
  axisBottom as d3AxisBottom,
  AxisDomain,
  axisLeft as d3AxisLeft,
  AxisScale,
  select,
  Selection,
  Transition
} from "d3";
import {elementFromSelection} from "../../utilities/d3/util";
import {updateBreakpointStatesInCSS} from "../../data";
import {AxisValid} from "./axis-validation";
import {getCurrentResponsiveValue} from "../../data/responsive-value/responsive-value";
import {calcTickAngle} from "./axis-tick-orientation";
import {RotationDirection} from "../../constants/types";

export type AxisSelection = Selection<SVGSVGElement | SVGGElement, AxisValid>;
export type AxisTransition = Transition<SVGSVGElement | SVGGElement, AxisValid>;

export function axisLeftRender(selection: AxisSelection): void {
  selection.classed('axis axis-left', true)
    .each((d, i, g) => {
      return axisRender(select(g[i]), d3Axis(d3AxisLeft, selection))
    })
}

export function axisBottomRender(selection: AxisSelection): void {
  selection.classed('axis axis-bottom', true)
    .each((d, i, g) => axisRender(select(g[i]), d3Axis(d3AxisBottom, selection)))
}

export function axisSequenceRender(selection: AxisSelection): void {
  selection.classed('axis axis-sequence', true)
    .each((d, i, g) => axisRender(select(g[i]), d3Axis(d3AxisLeft, selection)))
}

function axisRender(selection: AxisSelection, a: D3Axis<AxisDomain>): void {
  const axisD = selection.datum()
  const axisElement = elementFromSelection(selection)
  const chartElement = elementFromSelection(axisD.renderer.chartSelection)
  // updateBoundStateInCSS(axisElement, axisD.bounds) //IS DONE IN d3Axis for now

  selection
    .selectAll('.title')
    .data([null])
    .join('g')
    .classed('title', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data([null])
    .join('text')
    .text(getCurrentResponsiveValue(axisD.title, {chart: chartElement, self: axisElement}))

  selection.selectAll('.subtitle')
    .data([null])
    .join('g')
    .classed('subtitle', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data([null])
    .join('text')
    .text(getCurrentResponsiveValue(axisD.subTitle, {chart: chartElement, self: axisElement}))

  const ticksS = selection
    .selectAll('.ticks-transform')
    .data([null])
    .join('g')
    .classed('ticks-transform', true)
    .selectAll<SVGGElement, any>('.ticks')
    .data([null])
    .join('g')
    .classed('ticks', true)
    .attr('data-ignore-layout-children', true);

  a(ticksS);

  ticksS
    .attr('fill', null)
    .attr('font-family', null)
    .attr('font-size', null)
    .attr('text-anchor', null);

  ticksS
    .selectAll<SVGGElement, string>('.tick')
    .attr('opacity', null)
    .attr('data-key', (d) => d);

  ticksS.selectAll('.tick')
    .selectAll('.pivot')
    .data([null])
    .join('g')
    .classed('pivot', true)
  const angle = calcTickAngle(selection)
  // const orientation = calcOrientation()
  ticksS.selectAll<Element, any>('.tick').each((d, i, g) => {
    configureTick(select(g[i]), angle, selection.datum().tickOrientation.rotationDirection)
  });
  //
  // ticksS.selectAll('.tick line').attr('stroke', null);
  // ticksS.selectAll('.tick text').attr('fill', null).attr('dx', null).attr('dy', null);
  // ticksS.selectAll('.domain').attr('stroke', null).attr('fill', null);

  function configureTick(tickS: Selection<Element>, angle: number, rotationDirection: RotationDirection) {
    const textS = tickS.select('text')

    const x = textS.attr('x') || '0';
    const y = textS.attr('y') || '0';
    textS.attr('x', null).attr('y', null)

    const pivotS = tickS.select<SVGGElement>('.pivot')!
    pivotS.append(() => textS.node())

    //TODO: for now apply transformation only for horizontal axis because of different text styles etc.
    if (!axisD.tickOrientation || !axisElement.classList.contains('axis-bottom')) { //|| !selection.classed("axis-bottom")
      pivotS.attr('transform', `translate(${x}, ${y})`);
      return
    }

    let textAnchor: string
    let dominantBaseline: string
    if (rotationDirection === 'counterclockwise') {
      textAnchor = angle > 15 ? 'start' : 'middle'
      dominantBaseline = angle > 15 ? 'ideographic' : 'hanging'
    } else {
      textAnchor = angle < -15 ? 'end' : 'middle'
      dominantBaseline = angle < -15 ? 'ideographic' : 'hanging'
    }

    textS
      .style('text-anchor', textAnchor)
      .style('dominant-baseline', dominantBaseline)

    pivotS //.transition().duration(200) //TODO: enable D3 transitions when being able to differ between initial render and succeeding renders
      .attr("transform", "translate(" + x + "," + y + ") rotate(" + angle + ")")
  }

}

function d3Axis(
  axisGenerator: (scale: AxisScale<AxisDomain>) => D3Axis<AxisDomain>,
  selection: AxisSelection
): D3Axis<AxisDomain> {
  const {scale, bounds, configureAxis, renderer} = selection.datum()
  const axisElement = elementFromSelection(selection)
  updateBreakpointStatesInCSS(axisElement, bounds)
  const chartElement = elementFromSelection(renderer.chartSelection)
  const configureAxisValid = getCurrentResponsiveValue(configureAxis, {chart: chartElement, self: axisElement})

  const axis = axisGenerator(scale)
  configureAxisValid(axis)
  return axis;
}
