import {select, Selection} from "d3";
import {InputLabel} from "./input-label";
import {applyClassList} from "../../../../utilities/d3/selection";

export type LabelsParentData = {
  labelData: InputLabel[]
}

export function renderInputLabels(itemsS: Selection<any, LabelsParentData>) {
  itemsS.each(function (d, i, g) {
    const {labelData} = d
    select(g[i]).selectChildren<HTMLLabelElement, InputLabel>('label')
      .data(labelData)
      .join('label')
      .each((d, i, g) => renderInputLabel(select<HTMLLabelElement, InputLabel>(g[i])))
  })
}

export function renderInputLabel<D extends InputLabel>(labelS: Selection<HTMLLabelElement, D>) {
  const d = labelS.datum()
  d.render(labelS)
  labelS.on('click.callback', function (e) { d.data.onClick?.(e, d.data.type) })
  labelS.selectAll('input')
    .attr('size', d.data.size ?? null)
    .on('click.callback', function (e) { d.data.onInputClick?.(e, d.data.type) })
  applyClassList(labelS, d.data.activeClasses ?? [], true)
  applyClassList(labelS, d.data.inactiveClasses ?? [], false)
}
