import {SelectionOrTransition} from "../../utilities/d3/selection";
import {Rect} from "../../data/shapes/rect";
import {elementIs} from "../../utilities/element";
import {select} from "d3";

export function pathRect(selectionOrTransition: SelectionOrTransition | Element, rect: Rect): void {
  const {x, y, width: w, height: h} = rect;
  selectionOrTransition = elementIs(selectionOrTransition)
    ? select(selectionOrTransition)
    : selectionOrTransition;
  selectionOrTransition.attr('d', `M ${x} ${y} h ${w} v ${h} h ${-w} v ${-h}`);
}
