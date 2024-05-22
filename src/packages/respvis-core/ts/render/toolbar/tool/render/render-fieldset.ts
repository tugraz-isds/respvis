import {select, Selection} from "d3";
import {addRawSVGToSelection, classesForSelection} from "../../../../utilities/d3/util";
import {InputLabel} from "../input-label/input-label";
import CollapseDownRAW from '../../../../../../../assets/svg/collapse-down.svg';
import {mapSelection} from "../../../../utilities/d3/selection";
import {inputLabelRender} from "../input-label/input-labels-render";

export type FieldSetData = {
  legend: string
  collapsable?: boolean
  filterable?: InputLabel
}

export function renderFieldset<D extends FieldSetData>(
  parentS: Selection, data: D[], ...classes: string[]) {

  const {names, selector} = classesForSelection(classes)
  const itemS = parentS.selectAll<HTMLFieldSetElement, InputLabel>(selector)
    .data(data)
    .join('fieldset')
    .classed(names, true)

  itemS.each(function (d, i, g) {
    const currentItemS = select<HTMLFieldSetElement, typeof d>(g[i])
    currentItemS.selectAll<HTMLLegendElement, any>('legend')
      .data([null])
      .join('legend')
      .call((s) => fieldsetLegendRender(s, d))
    if (d.collapsable) fieldsetCollapseWrapperRender(currentItemS)
  })

  return mapSelection(itemS, (currentS) => {
    const collapsableS = currentS.selectAll<HTMLElement, D>('.collapsable')
    return !collapsableS.empty() ? collapsableS : itemS
  })
}

function fieldsetLegendRender(legendS: Selection<HTMLLegendElement>, data: FieldSetData) {
  legendS.selectAll<any, InputLabel>('.active')
    .data(data.filterable ? [data.filterable] : [])
    .join('label')
    .classed('active', true)
    .each((d, i, g) => inputLabelRender(select<HTMLLabelElement, InputLabel>(g[i])))
  legendS.selectAll<any, string>('.text')
    .data([data.legend])
    .join('span')
    .classed('text', true)
    .text(d => d)

  legendS.selectAll(".collapse-icon")
    .data(data.collapsable ? [CollapseDownRAW] : [])
    .join('span')
    .classed('collapse-icon', true)
    .each((d,i,g) => addRawSVGToSelection(select(g[i]), CollapseDownRAW))
}

export function fieldsetCollapseWrapperRender<D extends FieldSetData>
(fieldsetS: Selection<HTMLFieldSetElement, D>) {
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
      const legendS = select<HTMLLegendElement, string>(g[i])
      collapsableWrapperS.classed('expanded', () => !currentlyCollapsed)
      legendS.selectChildren('.text, .collapse-icon').on('click.toggleCollapsable', () => {
        collapsableWrapperS.classed('expanded', () => !collapsableWrapperS.classed('expanded'))
        collapsableWrapperS.classed('collapsed', () => !collapsableWrapperS.classed('collapsed'))
      })
    })
  return fieldsetS
}
