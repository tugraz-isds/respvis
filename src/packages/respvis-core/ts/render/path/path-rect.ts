import {SelectionOrTransition} from "../../utilities/d3/selection";
import {Rect} from "../../utilities/geometry/shapes/rect/rect";
import {isElement} from "../../utilities/dom/element";
import {select} from "d3";

export function pathRect(selectionOrTransition: SelectionOrTransition | Element, rect: Rect): void {
  const {x, y, width: w, height: h} = rect;
  selectionOrTransition = isElement(selectionOrTransition)
    ? select(selectionOrTransition)
    : selectionOrTransition;
  selectionOrTransition.attr('d', `M ${x} ${y} h ${w} v ${h} h ${-w} v ${-h}`);
}
