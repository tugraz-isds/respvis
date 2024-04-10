import {Selection} from "d3";
import {classesForSelection} from "../d3/util";

export function pathArrowsUpDownRender(selection: Selection, classes: string[]) {
  const paths = [
    "M17 3l0 18", "M10 18l-3 3l-3 -3",
    "M7 21l0 -18", "M20 6l-3 -3l-3 3"
  ]
  return pathRender(selection, classes, paths)
}

export function pathArrowBigDown(selection: Selection, classes: string[]) {
  const paths = ["M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"]
  return pathRender(selection, classes, paths)
}

export function pathArrowBigRight(selection: Selection, classes: string[]) {
  const paths = ["M4 9h8v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z"]
  return pathRender(selection, classes, paths)
}

function pathRender(selection: Selection, classes: string[], paths: string[]) {
  const {selector, names} = classesForSelection(classes)
  let group = selection.selectAll<SVGGElement, any>(selector)
    if (group.empty()) {
      group = group.data([null])
        .join('g')
        .classed(names, true)
        .attr('data-ignore-layout-children', true)
    }
  let rotationGroup = group.selectAll('.rotation-group')
    if (rotationGroup.empty()) {
      rotationGroup = rotationGroup.data([null])
        .join('g')
        .classed('rotation-group', true)
    }
  rotationGroup.selectAll('path')
    .data(paths)
    .join('path')
    .attr('d', d => d)
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('stroke', '#2c3e50')
    .attr('pointer-events', 'none')
  return group
}
