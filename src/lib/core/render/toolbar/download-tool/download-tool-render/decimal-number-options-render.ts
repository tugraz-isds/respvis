import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {NumberLabel} from "../../tool/input-label/number-label";
import {CheckBoxLabel} from "../../tool/input-label/checkbox-label";
import {windowSettingsKeys} from "../../../window/window-settings";
import {fieldsetRender} from "../../tool/fieldset-render";

export function decimalNumberOptionsRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChangeActive = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const onNumberInput = (e, d: NumberLabel) => {
    const type = d.data.type
    const target = e.target as HTMLInputElement
    const value = parseInt(target.value)
    if (isNaN(value)) e.target.value = currentSettings[type]
  }
  const onChangeNumber = (e, d: NumberLabel) => {
    const type = d.data.type
    const target = e.target as HTMLInputElement
    const value = parseInt(target.value)
    if (isNaN(value) || (d.data.min && value < d.data.min) || (d.data.max && value > d.data.max)) {
      e.target.value = currentSettings[type]
    }
    currentSettings[d.data.type] = (e.target as HTMLInputElement).value
  }

  const data = [{
    legend: 'Number of Decimal Points',
    labelData: [new CheckBoxLabel({
      label: 'Limit Decimal Points',
      type: windowSettingsKeys.downloadAttributeMaxDecimalsActive,
      defaultVal: currentSettings.downloadAttributeMaxDecimalsActive,
      onChange: onChangeActive,
    }), new NumberLabel({
      label: '',
      type: windowSettingsKeys.downloadAttributeMaxDecimals,
      value: currentSettings.downloadAttributeMaxDecimals,
      min: 1, max: 20, step: 1,
      onInput: onNumberInput,
      onChange: onChangeNumber,
      class: !currentSettings.downloadAttributeMaxDecimalsActive ? 'disabled' : ''
    })
    ]
  }]
  return fieldsetRender(selection, data, 'item', 'item--decimal-options')
}
