import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {NumberLabel} from "../../tool/input-label/number-label";
import {CheckBoxLabel} from "../../tool/input-label/checkbox-label";
import {windowSettingsKeys} from "../../../window/window-settings";
import {renderFieldset} from "../../tool/render/render-fieldset";
import {validateNumberLabel} from "../../../../utilities/dom/validateInputs";

export function renderDecimalNumberOptions(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().settings.state
  const onChangeActive = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const onChangeNumber = (e, d: NumberLabel) => {
    const value = validateNumberLabel(e.target, d)
    if (value === null) return
    currentSettings[d.data.type] = value
    e.target.value = value
  }

  const data = [{
    legend: 'Number of Decimal Places',
    labelData: [new CheckBoxLabel({
      label: 'Limit Decimal Places',
      type: windowSettingsKeys.downloadAttributeMaxDecimalsActive,
      defaultVal: currentSettings.downloadAttributeMaxDecimalsActive,
      onChange: onChangeActive,
    }), new NumberLabel({
      label: '',
      type: windowSettingsKeys.downloadAttributeMaxDecimals,
      initialValue: currentSettings.downloadAttributeMaxDecimals,
      min: 1, max: 20, step: 1, size: 2,
      onChange: onChangeNumber,
      activeClasses: !currentSettings.downloadAttributeMaxDecimalsActive ? ['disabled'] : [],
      inactiveClasses: currentSettings.downloadAttributeMaxDecimalsActive ? ['disabled'] : [],
    })
    ]
  }]
  return renderFieldset(selection, data, 'item', 'item--decimal-options')
}
