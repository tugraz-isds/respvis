import {select, Selection} from "d3";
import {addRawSVGToSelection, classesForSelection} from "../../../utilities/d3/util";
import {InputLabel} from "./input-label/input-label";
import CollapseDownRAW from '../../../assets/collapse-down.svg';

type FieldSetProps = {
  legend: string
  applyText?: boolean
}

export function fieldsetRender<D extends FieldSetProps>(
  parentS: Selection, data: D[], ...classes: string[]) {

  const {names, selector} = classesForSelection(classes)
  const itemS = parentS.selectAll<HTMLFieldSetElement, InputLabel>(selector)
    .data(data)
    .join('fieldset')
    .classed(names, true)

  itemS.each(function (d, i, g) {
    const legendS = select(g[i]).selectAll('legend')
      .data([d.legend])
      .join('legend')
    if (d.applyText !== false) {
      legendS.text(d => d)
    }
  })

  return itemS
}

export function collapsableFieldsetRender<D extends FieldSetProps>(
  parentS: Selection, data: D[], ...classes: string[]) {
  const collapseData = data.map(d => ({...d, applyText: false}))
  const fieldsetS = fieldsetRender(parentS, collapseData, ...classes)

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
      legendS.selectAll("span")
        .data([legendS.datum(), CollapseDownRAW])
        .join('span')
      legendS.selectAll<any, string>('span').filter((d, i) => i === 0).text(d => d)
      addRawSVGToSelection(legendS.selectAll<any, string>('span').filter((d, i) => i === 1), CollapseDownRAW)
      collapsableWrapperS.classed('expanded', () => !currentlyCollapsed)

      legendS.on('click.hope', () => {
        collapsableWrapperS.classed('expanded', () => !collapsableWrapperS.classed('expanded'))
        collapsableWrapperS.classed('collapsed', () => !collapsableWrapperS.classed('collapsed'))
      })
    })

  return fieldsetS.selectAll<HTMLDivElement, D>('.collapsable')
}
