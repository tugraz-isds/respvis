import {Selection} from "d3";

export function renderTool(parentS: Selection, ...additionalClasses: string[]) {
  const selector = additionalClasses.map(additionalClass => '.' + additionalClass).join('')
  const names = additionalClasses.map(additionalClass => ' ' + additionalClass).join('')
  return parentS
    .selectAll<HTMLDivElement, any>(`.tool${selector}`)
    .data([null])
    .join('div')
    .classed(`tool${names}`, true)
}
