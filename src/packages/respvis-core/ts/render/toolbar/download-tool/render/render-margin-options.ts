import {Selection} from "d3";
import {Renderer} from "../../../chart";
import {renderFieldset} from "../../tool";
import {windowSettingsKeys} from "../../../window";
import {NumberLabel} from "../../tool/input-label/number-label";

export function renderMarginOptions(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().settings

  const options = [{
    settingKey: windowSettingsKeys.downloadMarginLeft,
    abbreviation: 'left'
  }, {
    settingKey: windowSettingsKeys.downloadMarginTop,
    abbreviation: 'top'
  }, {
    settingKey: windowSettingsKeys.downloadMarginRight,
    abbreviation: 'right'
  }, {
    settingKey: windowSettingsKeys.downloadMarginBottom,
    abbreviation: 'bottom'
  }
  ]

  const onInputNumber = (e, d: NumberLabel) => {
    const value = d.valueAsInt(e)
    if (isNaN(value)) e.target.value = currentSettings.state[d.data.type]
  }
  const onChangeNumber = (e, d: NumberLabel) => {
    const value = d.valueAsInt(e)
    if (isNaN(value) || !d.inMinMaxRange(value)) {
      e.target.value = currentSettings.state[d.data.type]
    }
    currentSettings.state[d.data.type] = (e.target as HTMLInputElement).value
  }

  const data = [{
    legend: 'Margin',
    labelData: options.map(option => {
      return new NumberLabel({
        label: `Margin-${option.abbreviation}`,
        type: windowSettingsKeys[option.settingKey],
        value: currentSettings.get(option.settingKey),
        min: 0, max: 10000, step: 1, size: 5,
        onInput: onInputNumber,
        onChange: onChangeNumber,
      })
    })
  }]
  return renderFieldset(selection, data, 'item', 'item--margin-options')
}
