import {create, select, Selection} from "d3";
import {uniqueId} from "../utilities/unique";
import {getParentClassesRelative} from "../utilities/dom/get-parent-classes-relative";


export function layoutContainerRoots(layoutContainerS: Selection<SVGElement>, layouterS: Selection<HTMLDivElement>): Selection<HTMLDivElement, SVGElement> {
  const layoutContainerE = layoutContainerS.nodes()
  create('svg')
  layoutContainerE.forEach(el => { if (!el.id) el.id = uniqueId() })
  const containerPositionerS = layouterS.selectChildren<HTMLDivElement, SVGElement>('.layout.layout-container-positioner')
    .data(layoutContainerE, (d, i) => d.id)
    .join('div')
    .classed('layout layout-container-positioner', true)
    .each(function(d) {
      const parentClassesRelative = getParentClassesRelative(d, 'layouter')
      const parentClassesRelativeJoined = parentClassesRelative.map(list => Array.from(list).join('.'))
      select(this).selectChildren('.layout.layout-container')
        .data([d])
        .join('div')
        .classed('layout layout-container', true)
        .attr('parent-classes', parentClassesRelativeJoined)
    })
    .style('position', 'fixed')
  //TODO: set exact position to corresponding svg element

  return containerPositionerS.selectChildren<HTMLDivElement, SVGElement>('.layout.layout-container')

  // layoutContainerS
  //   .data([])
  //   .selectChildren<HTMLDivElement, SVGElement>('.layout')
  //   .data(layedOutChildren(layoutContainerS))
  //   .join('div');
}
