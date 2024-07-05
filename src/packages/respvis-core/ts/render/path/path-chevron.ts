import {Selection} from "d3";
import {pathScale} from "./path";
import {createSelectionClasses} from "../../utilities";

type ChevronData = {
  type: 'down' | 'right' | null
  scale: number,
}

export function pathChevronRender(selection: Selection, classes: string[], data?: ChevronData[]) {
  const {selector, classString} = createSelectionClasses(classes)

  const group = selection.selectAll<SVGGElement, any>(selector)
    .data([null])
    .join('g')
    .classed(classString, true)
    .attr('data-ignore-layout-children', true)
  group.selectAll('path')
    .data(data ?? [{type: "right", scale: 1}])
    .join('path')
    .attr('d', d => d.type === 'right' ?
        pathScale("M0,0 l6,6 l-6,6 l0,-12", d.scale) :
        pathScale("M0,0 l6,6 l6,-6 l-12,0", d.scale)
    ).attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('stroke', '#2c3e50')
    .attr('pointer-events', 'none')

  // M6,0.8 l6,6 l6,-6
  return group
}
