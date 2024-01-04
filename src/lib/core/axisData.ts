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
import {
  Boundable, boundArgByIndices,
  getBoundableIndices,
  TickOrientation
} from "./utilities/resizing/matchBounds";
import {calcTickAngle} from "./utilities/resizing/resizeTicks";
import {ScaleAny} from "./utilities/scale";
import {BoundArg, Bounds} from "./utilities/resizing/types";

export type AxisArgs = {
  values: number[][], //TODO: add strings/dates, also for y
  scale?: AxisScale<AxisDomain>,
  bounds?: Partial<Boundable>
  title?: BoundArg<string>,
  subTitle?: BoundArg<string>,
  configureAxis?: ConfigureAxisFn,
  tickOrientation?: TickOrientation
}

export type AxisData = Required<Omit<AxisArgs, 'tickOrientation' | 'bounds'>> & {
  tickOrientation?: TickOrientation,
  bounds: Boundable
}

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function axisData(data: AxisArgs): AxisData {
  //TODO: for scale use min and max values of data points
  //TODO: sort bounds
  return {
    values: data.values,
    scale: data.scale || scaleLinear().domain([0, 1]).range([0, 600]),
    title: data.title || '',
    subTitle: data.subTitle || '',
    configureAxis: data.configureAxis || (() => {}),
    tickOrientation: data.tickOrientation,
    bounds: {
      width: data.bounds?.width ?? {
        unit: 'rem',
        values: []
      },
      height: data.bounds?.height ?? {
        unit: 'rem',
        values: []
      }
    }
  }
}

export type AxisSelection = Selection<SVGSVGElement | SVGGElement, AxisData>;
export type AxisTransition = Transition<SVGSVGElement | SVGGElement, AxisData>;

export function axisLeftRender(selection: AxisSelection): void {
  selection.classed('axis axis-left', true)
    .each((d, i, g) => {
      return axisRender(select(g[i]), d3Axis(d3AxisLeft, d), d)
    })
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
  axisD: AxisData
): void {
  const axisElement = selection.node()
  if (!axisElement) return
  const indices = getBoundableIndices(axisElement, axisD.bounds)
  selection
    .selectAll('.title')
    .data([null])
    .join('g')
    .classed('title', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data([null])
    .join('text')
    .text(boundArgByIndices(indices, axisD.title))

  selection.selectAll('.subtitle')
    .data([null])
    .join('g')
    .classed('subtitle', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data([null])
    .join('text')
    .text(boundArgByIndices(indices, axisD.subTitle))

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
  data: AxisData
): D3Axis<AxisDomain> {
  const axis = axisGenerator(data.scale);
  data.configureAxis(axis);
  return axis;
}
