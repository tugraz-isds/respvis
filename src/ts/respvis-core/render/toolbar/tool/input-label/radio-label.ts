import {Selection} from "d3";
import {InputLabel, InputLabelDataBase} from "./input-label";

export type RadioLabelsData = Omit<RadioLabelData, 'value' | 'label'> & {
  options: Pick<RadioLabelData, 'value' | 'label'>[]
}

type RadioLabelData = InputLabelDataBase & {
  value: string,
  name: string,
  defaultVal: string,
  onChange?: (event: InputEvent, type: string) => void
}

export class RadioLabel implements InputLabel {
  tag = 'radio'
  constructor(public readonly data: RadioLabelData) {}
  render(labelS: Selection<HTMLLabelElement, RadioLabelData>) {
    const {value, name, defaultVal, onChange, label, type} = this.data
    const inputS = labelS.selectAll('input[type="radio"]')
      .data([null])
      .join('input')
      .attr('type', 'radio')
      .attr('value', value)
      .attr('name', name)
      .on('change', (e) => onChange?.(e, type))
    if (defaultVal === value) inputS.attr('checked', true)
    labelS.selectAll('span')
      .data([null])
      .join('span')
      .text(label)
    return labelS
  }
}
