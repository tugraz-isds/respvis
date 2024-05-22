import {Selection} from "d3";
import {classesForSelection} from "../../../../utilities/d3/util";

type TooltipSimpleData = {
  text: string
}
export function renderSimpleTooltip(parentS: Selection, data: TooltipSimpleData, ...classes: string[]) {
  const {names, selector} = classesForSelection(['tooltip-simple', ...classes])
  return parentS.selectAll<HTMLButtonElement, any>(selector)
    .data([data])
    .join('div')
    .classed(names, true)
    .text(data.text)
}
