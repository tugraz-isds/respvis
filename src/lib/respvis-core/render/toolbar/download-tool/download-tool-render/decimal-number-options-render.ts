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

  const onInputNumber = (e, d: NumberLabel) => {
    const value = d.valueAsInt(e)
    if (isNaN(value)) e.target.value = currentSettings[d.data.type]
  }
  const onChangeNumber = (e, d: NumberLabel) => {
    const value = d.valueAsInt(e)
    if (isNaN(value) || d.inMinMaxRange(value)) {
      e.target.value = currentSettings[d.data.type]
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
      onInput: onInputNumber,
      onChange: onChangeNumber,
      activeClasses: !currentSettings.downloadAttributeMaxDecimalsActive ? ['disabled'] : [],
      inactiveClasses: currentSettings.downloadAttributeMaxDecimalsActive ? ['disabled'] : [],
    })
    ]
  }]
  return fieldsetRender(selection, data, 'item', 'item--decimal-options')
}
