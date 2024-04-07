import {Selection} from "d3";

import {InputLabel, InputLabelDataBase} from "./input-label";

export type CheckboxLabelData = InputLabelDataBase & {
  dataKey?: string
  defaultVal?: boolean,
  onChange?: (e: InputEvent, type: string) => void
}

export class CheckBoxLabel implements InputLabel {
  tag = 'checkbox'
  constructor(public readonly data: CheckboxLabelData) {}
  render(labelS: Selection<HTMLLabelElement>) {
    const data = this.data

    const inputS = labelS.selectAll('input[type="checkbox"]')
      .data([data])
      .join('input')
      .attr('type', 'checkbox')
      .on('change', function (e) {
        data.onChange?.(e, data.type)
      })
    if (data.defaultVal !== undefined) inputS.property('checked', data.defaultVal)
    if (data.dataKey) inputS.attr('data-key', data.dataKey)

    labelS.selectAll('span')
      .data([data])
      .join('span')
      .text(d => d.label)
    return labelS
  }
}
