import {Selection} from "d3";
import {InputLabel, InputLabelDataBase} from "./input-label";

type NumberLabelData = InputLabelDataBase & {
  value: string,
  min?: number
  max?: number
  step?: number
  onChange?: (event: InputEvent, labelD: NumberLabel) => void
  onInput?: (event: InputEvent, labelD: NumberLabel) => void
}

export class NumberLabel implements InputLabel {
  constructor(public readonly data: NumberLabelData) {}
  render(labelS: Selection<HTMLLabelElement, NumberLabelData>) {
    const {value, onChange, onInput,
      label, min, max,
      step} = this.data
    labelS.selectAll('input[type="number"]')
      .data([null])
      .join('input')
      .attr('type', 'number')
      .attr('value', value)
      .attr('min', min ?? null)
      .attr('max', max ?? null)
      .attr('step', step ?? null)
      .on('change', (e) => onChange?.(e, this))
      .on('input', (e) => onInput?.(e, this))
    labelS.selectAll('span')
      .data([null])
      .join('span')
      .text(label)
    return labelS
  }

  valueAsInt(e: InputEvent) {
    const target = e.target as HTMLInputElement
    return parseInt(target.value)
  }

  valueAsFloat(e: InputEvent) {
    const target = e.target as HTMLInputElement
    return parseFloat(target.value)
  }

  inMinMaxRange(value: number) {
    return (this.data.min && value < this.data.min) || (this.data.max && value > this.data.max)
  }
}
