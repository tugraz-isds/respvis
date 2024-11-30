import {Selection} from "d3";
import {Renderer} from "../../../chart";
import {renderFieldset} from "../../tool";
import {windowSettingsKeys} from "../../../window";
import {NumberLabel} from "../../tool/input-label/number-label";
import {validateNumberLabel} from "../../../../utilities/dom/validateInputs";

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

  const onChangeNumber = (e, d: NumberLabel) => {
    const value = validateNumberLabel(e.target, d)
    if (value === null) return
    currentSettings.state[d.data.type] = value
    e.target.value = value
  }

  const data = [{
    legend: 'Margin',
    labelData: options.map(option => {
      return new NumberLabel({
        label: `Margin-${option.abbreviation}`,
        type: windowSettingsKeys[option.settingKey],
        initialValue: currentSettings.get(option.settingKey),
        min: 0, max: 10000, step: 1, size: 5,
        onChange: onChangeNumber,
      })
    })
  }]
  return renderFieldset(selection, data, 'item', 'item--margin-options')
}
