import {Selection} from "d3";
import {classesForSelection} from "../d3/util";

type ChevronDirection = 'down' | 'right' | null

export function pathChevronRender(selection: Selection, classes: string[], data?: ChevronDirection[]) {
  const {selector, names} = classesForSelection(classes)

  const group = selection.selectAll<SVGGElement, any>(selector)
    .data([null])
    .join('g')
    .classed(names, true)
    .attr('data-ignore-layout-children', true)
  group.selectAll('path')
    .data(data ?? [null])
    .join('path')
    .attr('d', d => d === 'right' ?
      "M9 6l6 6l-6 6" :
      "M0,0.8 l6,6 l6,-6"
    ).attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('stroke', '#2c3e50')
    .attr('pointer-events', 'none')

  // M6,0.8 l6,6 l6,-6
  return group
}
