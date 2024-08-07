import {Selection} from "d3";
import {InputLabel, InputLabelDataBase} from "./input-label";

type RangeLabelData = InputLabelDataBase & {
  value: string,
  min?: number
  max?: number
  step?: number
  onChange?: (event: InputEvent, labelD: RangeLabel) => void
  onInput?: (event: InputEvent, labelD: RangeLabel) => void
  onDrag?: (event: DragEvent, labelD: RangeLabel) => void
}

export class RangeLabel implements InputLabel {
  constructor(public readonly data: RangeLabelData) {}
  render(labelS: Selection<HTMLLabelElement, RangeLabelData>) {
    const {value, onChange, onInput, onDrag,
      label, min, max, step} = this.data
    labelS.selectAll('input[type="range"]')
      .data([null])
      .join('input')
      .attr('type', 'range')
      .attr('min', min ?? null)
      .attr('max', max ?? null)
      .attr('step', step ?? null)
      .attr('value', value)
      .on('change', (e) => onChange?.(e, this))
      .on('input', (e) => onInput?.(e, this))
      .on('drag', (e) => onDrag?.(e, this))
    labelS.selectAll('span')
      .data([null])
      .join('span')
      .text(label)
    return labelS
  }
}
