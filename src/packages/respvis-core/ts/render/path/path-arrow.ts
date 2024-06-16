import {Selection} from "d3";
import {classesForSelection} from "../../utilities/d3/util";
import ArrowUpNarrowSVG from "../../../../../assets/svg/tablericons/arrow-up-narrow.svg"

export function pathArrowsUpDownRender(selection: Selection, classes: string[]) {
  const paths = [
    "M17 3l0 18", "M10 18l-3 3l-3 -3",
    "M7 21l0 -18", "M20 6l-3 -3l-3 3"
  ]
  return renderPaths(selection, classes, paths)
}

export function pathArrowBigDown(selection: Selection, classes: string[]) {
  const paths = ["M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"]
  return renderPaths(selection, classes, paths)
}

export function pathArrowBigLeft(selection: Selection, classes: string[]) {
  const paths = ["M20 15h-8v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h8a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1z"]
  return renderPaths(selection, classes, paths)
}

export function renderSVGArrowNarrowUp(selection: Selection, classes: string[]) {
  const {selector, names} = classesForSelection(classes)
  let rotationGroup = selection.selectAll<SVGGElement, any>('.svg-wrapper' + selector)
  const svgGroup = rotationGroup.selectAll('svg')
  if (rotationGroup.empty() || svgGroup.empty()) {
    rotationGroup = rotationGroup.data([null])
      .join('g')
      .classed('svg-wrapper', true)
      .classed(names, true)
    rotationGroup.html(ArrowUpNarrowSVG)
    rotationGroup.selectAll('svg')
      .attr('data-ignore-layout-children', true)
    return rotationGroup
  }
  return rotationGroup
  // const paths = [
  //   "M7 9l5 -6l5 6l-10 0",
  //   "M12 10l0 10"
  // ]
  // return renderPaths(selection, classes, paths)
}

function renderPaths(selection: Selection, classes: string[], paths: string[]) {
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
