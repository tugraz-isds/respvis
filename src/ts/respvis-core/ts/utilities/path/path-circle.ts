import {SelectionOrTransition} from "../d3/selection";
import {Circle} from "../graphic-elements/circle";
import {elementIs} from "../element";
import {select} from "d3";

export function pathCircle(
  selectionOrTransition: SelectionOrTransition | Element,
  circle: Circle
): void {
  const {
    center: {x: cx, y: cy},
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
