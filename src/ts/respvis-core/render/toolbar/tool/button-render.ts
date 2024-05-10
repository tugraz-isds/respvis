import {Selection} from "d3";
import {classesForSelection} from "../../../utilities/d3/util";

export function buttonRender(parentS: Selection, ...classes: string[]) {
  const {names, selector} = classesForSelection(classes)
  return parentS.selectAll<HTMLButtonElement, any>(selector)
    .data([null])
    .join('button')
    .classed(names, true)
}
