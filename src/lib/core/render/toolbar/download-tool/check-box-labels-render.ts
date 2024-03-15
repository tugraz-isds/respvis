import {select, Selection} from "d3";

export type CheckboxLabelsData = {
  labelData: LabelData[]
}

export function checkBoxLabelsRender(itemsS: Selection<any, CheckboxLabelsData>) {
  itemsS.each(function (d, i, g) {
    const { labelData } = d
    select(g[i]).selectAll('label')
      .data(labelData)
      .join('label')
      .each(function (d, i, g) {
        const labelS = select<any, typeof d>(g[i])
        labelS.call(renderLabel)
          .classed(d.class ?? '', true)
        if (!d.class) labelS.attr('class', null)
      })
  })
}

type LabelData = {
  label: string,
  type: string,
  defaultVal: boolean,
  class?: string
  onChange: (e: InputEvent, type: string) => void
}
function renderLabel(labelS: Selection<any, LabelData>) {
  const data = labelS.datum()

  const inputS = labelS.selectAll('input[type="checkbox"]')
    .data([data])
    .join('input')
    .attr('type', 'checkbox')
    .on('change', function (e) {
      data.onChange(e, data.type)
    })
  if (data.defaultVal) inputS.attr('checked', data.defaultVal)

  labelS.selectAll('span')
    .data([data])
    .join('span')
    .text(d => d.label)
}
