import {SelectionOrTransition} from "../d3/selection";
import {Rect} from "../graphic-elements/rect";
import {elementIs} from "../element";
import {select} from "d3";

export function pathRect(selectionOrTransition: SelectionOrTransition | Element, rect: Rect): void {
  const {x, y, width: w, height: h} = rect;
  selectionOrTransition = elementIs(selectionOrTransition)
    ? select(selectionOrTransition)
    : selectionOrTransition;
  selectionOrTransition.attr('d', `M ${x} ${y} h ${w} v ${h} h ${-w} v ${-h}`);
}
