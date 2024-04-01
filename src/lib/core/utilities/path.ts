import {SelectionOrTransition} from './d3/selection';
import {Circle} from './circle';
import {Rect} from './rect';
import {elementIs} from './element';
import {select, Selection} from 'd3';
import {Position} from '..';
import {classesForSelection} from './d3/util';

export function pathRect(selectionOrTransition: SelectionOrTransition | Element, rect: Rect): void {
  const { x, y, width: w, height: h } = rect;
  selectionOrTransition = elementIs(selectionOrTransition)
    ? select(selectionOrTransition)
    : selectionOrTransition;
  selectionOrTransition.attr('d', `M ${x} ${y} h ${w} v ${h} h ${-w} v ${-h}`);
}

export function pathCircle(
  selectionOrTransition: SelectionOrTransition | Element,
  circle: Circle
): void {
  const {
    center: { x: cx, y: cy },
    radius: r,
  } = circle;

  selectionOrTransition = elementIs(selectionOrTransition)
    ? select(selectionOrTransition)
    : selectionOrTransition;

  selectionOrTransition.attr(
    'd',
    `M ${cx - r} ${cy} 
    a ${r},${r} 0 1,0 ${r * 2},0 
    a ${r},${r} 0 1,0 -${r * 2},0`
  );
}

export function pathLine(
  selectionOrTransition: SelectionOrTransition | Element,
  positions: Position[]
): void {
  if (positions.length < 2) return;

  selectionOrTransition = elementIs(selectionOrTransition)
    ? select(selectionOrTransition)
    : selectionOrTransition;

  selectionOrTransition.attr('d', `M${positions.map((p) => `${p.x},${p.y}`).join('L')}`);
}

//src: https://tablericons.com/

type ChevronDirection = 'down' | 'right' | null
export function pathChevronRender(selection: Selection, classes: string[], data?: ChevronDirection[]) {
  const {selector, names} = classesForSelection(classes)

  const group = selection.selectAll<SVGGElement, any>(selector)
    .data([null])
    .join('g')
    .classed(names, true)
    .attr('data-ignore-layout-children', true)
  group.selectAll('path')
    .data(data ?? [null])
    .join('path')
    .attr('d', d => d === 'right' ?
      "M9 6l6 6l-6 6" :
      "M0,0.8 l6,6 l6,-6"
    ).attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('stroke', '#2c3e50')
    .attr('pointer-events', 'none')

  // M6,0.8 l6,6 l6,-6
  return group
}

export function pathArrowsUpDownRender(selection: Selection, classes: string[]) {
  const {selector, names} = classesForSelection(classes)
  const paths = [
    "M17 3l0 18", "M10 18l-3 3l-3 -3",
    "M7 21l0 -18", "M20 6l-3 -3l-3 3"
  ]
  const group = selection.selectAll<SVGGElement, any>(selector)
    .data([null])
    .join('g')
    .classed(names, true)
    .attr('data-ignore-layout-children', true)
  group.selectAll('path')
    .data(paths)
    .join('path')
    .attr('d', d => d)
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('stroke', '#2c3e50')
    .attr('pointer-events', 'none')
  return group
}
