import {SelectionOrTransition} from "../../d3";
import {Position} from "../position";
import {isElement} from "../../dom/element";
import {select} from "d3";

export function lineToPath(
  selectionOrTransition: SelectionOrTransition | Element,
  positions: Position[]
): void {
  if (positions.length < 2) return;

  selectionOrTransition = isElement(selectionOrTransition)
    ? select(selectionOrTransition)
    : selectionOrTransition;

  selectionOrTransition.attr('d', `M${positions.map((p) => `${p.x},${p.y}`).join('L')}`);
}
