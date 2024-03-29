import {
  Axis as D3Axis,
  axisBottom as d3AxisBottom,
  AxisDomain,
  axisLeft as d3AxisLeft,
  AxisScale,
  scaleLinear,
  select,
  Selection,
  Transition,
} from 'd3';
import {findMatchingBoundsIndex, TickOrientation} from "./utilities/resizing/matchBounds";
import {calcTickAngle} from "./utilities/resizing/resizeTicks";

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export interface Axis {
  scale: AxisScale<AxisDomain>;
  title: string;
  subtitle: string;
  configureAxis: ConfigureAxisFn;
  tickOrientation?: TickOrientation
}

export function axisData(data: Partial<Axis>): Axis {
  return {
    scale: data.scale || scaleLinear().domain([0, 1]).range([0, 600]),
    title: data.title || '',
    subtitle: data.subtitle || '',
    configureAxis: data.configureAxis || (() => {
    }),
    tickOrientation: data.tickOrientation
  };
}

export type AxisSelection = Selection<SVGSVGElement | SVGGElement, Axis>;
export type AxisTransition = Transition<SVGSVGElement | SVGGElement, Axis>;

export function axisLeftRender(selection: AxisSelection): void {
  selection.classed('axis axis-left', true)
    .each((d, i, g) => axisRender(select(g[i]), d3Axis(d3AxisLeft, d), d))
}

export function axisBottomRender(selection: AxisSelection): void {
  selection.classed('axis axis-bottom', true)
    .each((d, i, g) => axisRender(select(g[i]), d3Axis(d3AxisBottom, d), d))
}

export function axisSequenceRender(selection: AxisSelection): void {
  selection.classed('axis axis-sequence', true)
    .each((d, i, g) => axisRender(select(g[i]), d3Axis(d3AxisLeft, d), d))
}

function axisRender(
  selection: AxisSelection,
  a: D3Axis<AxisDomain>,
  axisD: Axis
): void {
  selection
    .selectAll('.title')
    .data([null])
    .join('g')
    .classed('title', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data([null])
    .join('text')
    .text(axisD.title);

  selection.selectAll('.subtitle')
    .data([null])
    .join('g')
    .classed('subtitle', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data([null])
    .join('text')
    .text(axisD.subtitle);

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

  const orientation = calcOrientation()
  ticksS.selectAll<Element, any>('.tick').each((d, i, g) => {
    configureTick(select(g[i]))
  });

  ticksS.selectAll('.tick line').attr('stroke', null);
  ticksS.selectAll('.tick text').attr('fill', null).attr('dx', null).attr('dy', null);
  ticksS.selectAll('.domain').attr('stroke', null).attr('fill', null);

  function configureTick(tickS: Selection<Element>) {
    const textS = tickS.select('text');

    const x = textS.attr('x') || '0';
    const y = textS.attr('y') || '0';
    textS.attr('x', null).attr('y', null);

    const pivotS = tickS.select<SVGGElement>('.pivot')!;
    pivotS.append(() => textS.node());

    if (!orientation || !axisD.tickOrientation || !selection.classed("axis-bottom")) {
      pivotS.attr('transform', `translate(${x}, ${y})`);
      return
    }

    const rotationDirection = orientation.angle > 15 ? 'clockwise' : orientation.angle < -15 ? 'counterclockwise' : 'none'
    textS.attr('angle', rotationDirection !== 'none' ? axisD.tickOrientation?.orientation[orientation.orientationIndex] : 'horizontal')
      .style('text-anchor', rotationDirection === 'clockwise' ? 'start' : rotationDirection === 'counterclockwise' ? 'end' : 'middle')
      .style('dominant-baseline', rotationDirection !== 'none' ? 'central' : 'hanging')
    //TODO: no interpolation possible for text-anchor. Maybe do tranform translate workaround
    // console.log(orientation.angle)
    // const {width, height} = pivotS.node()!.getBoundingClientRect()
    pivotS //.transition().duration(200) //TODO: enable D3 transitions when being able to differ between initial render and succeeding renders
      .attr("transform", "translate(" + x + "," + y + ") rotate(" + orientation.angle + ")");
  }

  function calcOrientation() {
    const tickOrientation = axisD.tickOrientation
    const axisElement = axisD.tickOrientation?.boundElement ?? selection.select<SVGGElement>('.domain').node()
    if (!tickOrientation || !axisElement) return undefined
    // console.log(axisElement, tickOrientation)
    const angle = calcTickAngle(axisElement, tickOrientation)
    const boundIndex = findMatchingBoundsIndex(axisElement, tickOrientation.bounds)
    const orientationIndex = boundIndex >= 0 ? boundIndex : tickOrientation.orientation.length - 1
    return {
      angle, boundIndex, orientationIndex
    }
  }

}

function d3Axis(
  axisGenerator: (scale: AxisScale<AxisDomain>) => D3Axis<AxisDomain>,
  data: Axis
): D3Axis<AxisDomain> {
  const axis = axisGenerator(data.scale);
  data.configureAxis(axis);
  return axis;
}
