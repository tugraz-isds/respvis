import {select, Selection} from "d3";
import {RadioLabelsData} from "./radio-labels-render";
import {classesForSelection} from "../../../utilities/d3/util";

type WithLegend = {legend: string}
export function fieldsetRender<D extends WithLegend>(
  parentS: Selection, data: D[], ...classes: string[]) {

  const {names, selector} = classesForSelection(classes)
  const itemS = parentS.selectAll<HTMLFieldSetElement, RadioLabelsData>(selector)
    .data(data)
    .join('fieldset')
    .classed(names, true)

  itemS.each(function (d, i, g) {
    select(g[i]).selectAll('legend')
      .data([d.legend])
      .join('legend')
      .text(d => d)
  })

  return itemS
}

export function collapsableFieldsetRender<D extends WithLegend>(
  parentS: Selection, data: D[], ...classes: string[]) {
  const fieldsetS = fieldsetRender(parentS, data, ...classes)
  fieldsetS.each(function(d, i, g) {
    const collapsableWrapperS = select(g[i]).selectAll('.collapsable-wrapper')
      .data([null])
      .join('div')
      .classed('collapsable-wrapper', true)
    collapsableWrapperS.selectAll('.collapsable').data([d])
      .join('div')
      .classed('collapsable', true)
  })

  fieldsetS.selectAll<HTMLLegendElement, unknown>('legend')
    .classed('collapsable-opener', true)
    .each(function (d, i, g) {
      const collapsableWrapperS = select(g[i].parentElement).select('.collapsable-wrapper')
      const currentlyCollapsed = collapsableWrapperS.classed('collapsed')
      const legendS = select(g[i])
      legendS.text(legendS.text() + ' - ')
      legendS.text(alterCollapseEnd(legendS.text(), currentlyCollapsed))
      collapsableWrapperS.classed('expanded', () => !currentlyCollapsed)
      select(g[i]).on('click', () => {
        collapsableWrapperS.classed('expanded', () => !collapsableWrapperS.classed('expanded'))
        collapsableWrapperS.classed('collapsed', () => !collapsableWrapperS.classed('collapsed'))
        const currentlyCollapsed = collapsableWrapperS.classed('collapsed')
        legendS.text(alterCollapseEnd(legendS.text(), currentlyCollapsed))
      })
    })

  function alterCollapseEnd(prev: string, currentlyCollapsed: boolean) {
    if (currentlyCollapsed) return prev.slice(0, prev.length - 3) + ' + '
    return prev.slice(0, prev.length - 3) + ' - '
  }

  return fieldsetS.selectAll<HTMLDivElement, D>('.collapsable')
}
