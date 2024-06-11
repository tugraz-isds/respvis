import {Selection} from "d3";
import {InputLabel, InputLabelDataBase} from "./input-label";
import {renderSimpleTooltip} from "../render/render-simple-tooltip";
import {addRawSVGToSelection} from "respvis-core";
import InfoSVG from '../../../../../../../assets/svg/tablericons/info-icon.svg'

export type RadioLabelsData = Omit<RadioLabelData, 'value' | 'label'> & {
  options: Pick<RadioLabelData, 'value' | 'label'>[]
}

type RadioLabelData = InputLabelDataBase & {
  value: string,
  name: string,
  defaultVal: string,
  onChange?: (event: InputEvent, type: string) => void,
  info?: string
}

export class RadioLabel implements InputLabel {
  tag = 'radio'
  constructor(public readonly data: RadioLabelData) {}
  render(labelS: Selection<HTMLLabelElement, RadioLabelData>) {
    const {value, name, defaultVal,
      onChange, label, type,
    info } = this.data
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
    if (info) {
      const infoButtonS = labelS.selectAll('.info__button')
        .data([null])
        .join('button')
        .classed('info__button', true)
      addRawSVGToSelection(infoButtonS, InfoSVG)
      renderSimpleTooltip(infoButtonS, {text: info})
    }
    return labelS
  }
}
