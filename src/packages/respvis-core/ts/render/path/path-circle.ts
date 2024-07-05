import {SelectionOrTransition} from "../../utilities/d3/selection";
import {Circle} from "../../utilities/geometry/shapes/circle";
import {isElement} from "../../utilities/dom/element";
import {select} from "d3";

export function pathCircle(
  selectionOrTransition: SelectionOrTransition | Element,
  circle: Circle
): void {
  const {
    center: {x: cx, y: cy},
    radius: r,
  } = circle;

  selectionOrTransition = isElement(selectionOrTransition)
    ? select(selectionOrTransition)
    : selectionOrTransition;

  selectionOrTransition.attr(
    'd',
    `M ${cx - r} ${cy} 
    a ${r},${r} 0 1,0 ${r * 2},0 
    a ${r},${r} 0 1,0 -${r * 2},0`
  );
}
