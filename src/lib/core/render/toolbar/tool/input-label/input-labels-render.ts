import {select, Selection} from "d3";
import {InputLabel} from "./input-label";

export type LabelsParentData = {
  labelData: InputLabel[]
}

export function inputLabelsRender(itemsS: Selection<any, LabelsParentData>) {
  itemsS.each(function (d, i, g) {
    const {labelData} = d
    select(g[i]).selectAll('label')
      .data(labelData)
      .join('label')
      .each(function (d, i, g) {
        const labelS = select<any, typeof d>(g[i])
        d.render(labelS)
        labelS.classed(d.data.class ?? '', true)
        if (!d.data.class) labelS.attr('class', null)
      })
  })
}
