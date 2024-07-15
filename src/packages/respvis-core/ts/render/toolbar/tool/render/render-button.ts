import {Selection} from "d3";

import {createSelectionClasses} from "../../../../utilities/d3";

export function renderButton(parentS: Selection, ...classes: string[]) {
  const {classString, selector} = createSelectionClasses(classes)
  return parentS.selectAll<HTMLButtonElement, any>(selector)
    .data([null])
    .join('button')
    .classed(classString, true)
}
