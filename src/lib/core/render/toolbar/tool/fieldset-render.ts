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
