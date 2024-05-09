import {select, Selection} from "d3";
import {InputLabel} from "./input-label";
import {applyClassList} from "../../../../utilities/d3/selection";

export type LabelsParentData = {
  labelData: InputLabel[]
}

export function inputLabelsRender(itemsS: Selection<any, LabelsParentData>) {
  itemsS.each(function (d, i, g) {
    const {labelData} = d
    select(g[i]).selectChildren<HTMLLabelElement, InputLabel>('label')
      .data(labelData)
      .join('label')
      .each((d, i, g) => inputLabelRender(select<HTMLLabelElement, InputLabel>(g[i])))
  })
}

export function inputLabelRender<D extends InputLabel>(labelS: Selection<HTMLLabelElement, D>) {
  const d = labelS.datum()
  d.render(labelS)
  labelS.on('click.callback', function (e) { d.data.onClick?.(e, d.data.type) })
  labelS.selectAll('input').on('click.callback', function (e) { d.data.onInputClick?.(e, d.data.type) })
  applyClassList(labelS, d.data.activeClasses ?? [], true)
  applyClassList(labelS, d.data.inactiveClasses ?? [], false)
}
