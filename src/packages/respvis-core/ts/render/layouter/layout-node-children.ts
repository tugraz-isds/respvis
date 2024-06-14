import {select, selectAll, Selection} from "d3";
import {SVGTwinInformation} from "./layouter-compute";

export function layoutNodeChildren(
  selection: Selection<HTMLDivElement, SVGTwinInformation>
): Selection<HTMLDivElement, SVGTwinInformation> {
  const childS = selection
    .selectChildren<HTMLDivElement, SVGTwinInformation>('.layout')
    .data((d) => layedOutChildren(d))
    .join(enter => {
      const div = enter.append('div')
      div.each(function (d, i, g) {
        if (!d.element.classList.contains('layout-container')) return
        select(g[i])
          .classed('layout layout-container-positioner', true)
          .style('position', 'fixed')
      })
      return div
    })
    .each(function (d, i, g) {
      if (!select(g[i]).classed('layout layout-container-positioner')) return
      select(g[i]).selectChildren('.layout.layout-container')
        .data([d])
        .join('div')
        .classed('layout layout-container', true)
    })

  const filteredChildS = childS.filter(':not(.layout-container-positioner)')
  const filteredChildPositionerS = childS.filter('.layout-container-positioner').selectChildren<HTMLDivElement, SVGTwinInformation>('*')

  return selectAll<HTMLDivElement, SVGTwinInformation>([...filteredChildS.nodes(), ...filteredChildPositionerS.nodes()])
}

export function layedOutChildren(parent: SVGTwinInformation): SVGTwinInformation[] {
  let parentIgnoresChildrenAttr = false
  const parentSFiltered = select(parent.element).filter((d, i, g) => {
    parentIgnoresChildrenAttr = !!select(g[i]).attr('data-ignore-layout-children')

    const hasNoLayoutContainerDescandant = select(g[i]).selectAll('.layout-container').empty()
    return !(parentIgnoresChildrenAttr && hasNoLayoutContainerDescandant)
  })

  let information: SVGTwinInformation[] = []
  parentSFiltered.selectChildren<SVGElement, unknown>(':not(.layout)')
    .each(function (d, i, g) {
      const isLayoutContainer = select(g[i]).classed('layout-container')
      const ignoreSelfAttr = select(g[i]).attr('data-ignore-layout')
      const hasNoLayoutContainerDescendant = select(g[i]).selectAll('.layout-container').empty()

      const ignoreBoundsBecauseOfParent = parentIgnoresChildrenAttr && !isLayoutContainer
      const ignoreBoundsBecauseOfSelf = ignoreSelfAttr && !isLayoutContainer
      const ignoreBoundsBecauseInBetween = parent.ignoredByAncestor && !isLayoutContainer
      const ignoreBounds = ignoreBoundsBecauseOfParent || ignoreBoundsBecauseOfSelf || ignoreBoundsBecauseInBetween
      if (ignoreBounds && hasNoLayoutContainerDescendant) return

      information.push({
        element: this,
        ignoredByAncestor: (parentIgnoresChildrenAttr || ignoreSelfAttr) ? true :
          parent.ignoredByAncestor && !isLayoutContainer,
        ignoreBounds
      })
    })
  return information
}
