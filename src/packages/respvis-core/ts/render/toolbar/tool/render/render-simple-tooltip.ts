import {Selection} from "d3";

import {createSelectionClasses} from "respvis-core";

type TooltipSimpleData = {
  text: string
}
export function renderSimpleTooltip(parentS: Selection, data: TooltipSimpleData, ...classes: string[]) {
  const {classString, selector} = createSelectionClasses(['tooltip-simple', ...classes])
  return parentS.selectAll<HTMLButtonElement, any>(selector)
    .data([data])
    .join('div')
    .classed(classString, true)
    .text(data.text)
}
