import {SelectionOrTransition} from "../../utilities/d3/selection";
import {Position} from "../../data/position/position";
import {elementIs} from "../../utilities/element";
import {select} from "d3";

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
