import {select, Selection} from "d3";

export type RadioItemData = Omit<LabelData, 'value' | 'label'> & {
  legend: string,
  options: Pick<LabelData, 'value' | 'label'>[]
}
export function radioItemsRender(itemsS: Selection<any, RadioItemData>) {
  itemsS.each(function (d, i, g) {
    const { legend, options, type, name, defaultVal, onChange } = d
    select(g[i]).selectAll('legend')
      .data([legend])
      .join('legend')
      .text(d => d)

    select(g[i]).selectAll('label')
      .data(options.map(option => ({...option, type, name, defaultVal, onChange })))
      .join('label')
      .each(function (d, i, g) {
        renderLabel(select(g[i]))
      })
  })
}

type LabelData = {
  value: string,
  label: string,
  type: string,
  name: string,
  defaultVal: string,
  onChange: (event: InputEvent, type: string) => void
}

function renderLabel(labelS: Selection<any, LabelData>) {
  const {value, name, defaultVal, onChange, label, type} = labelS.datum()
  const inputS = labelS.selectAll('input[type="radio"]')
    .data([null])
    .join('input')
    .attr('type', 'radio')
    .attr('value', value)
    .attr('name', name)
    .on('change', (e) => onChange(e, type))
  if (defaultVal === value) inputS.attr('checked', true)
  labelS.selectAll('span')
    .data([null])
    .join('span')
    .text(label)
}
