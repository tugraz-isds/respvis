import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {CheckBoxLabel} from "../../tool/input-label/checkbox-label";
import {windowSettingsKeys} from "../../../window/window-settings";
import {renderFieldset} from "../../tool/render/render-fieldset";
import {NumberLabel} from "../../tool/input-label/number-label";

export function renderPrettifyOptions(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
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
    legend: 'Prettify SVG',
    labelData: [new CheckBoxLabel({
      label: 'Prettify SVG',
      type: windowSettingsKeys.downloadPrettifyActive,
      defaultVal: currentSettings.downloadPrettifyActive,
      onChange,
    }), new NumberLabel({
      label: 'Number of Spaces',
      type: windowSettingsKeys.downloadPrettifyIndentionSpaces,
      value: currentSettings.downloadPrettifyIndentionSpaces,
      min: 1, max: 20, step: 1,
      onInput: onInputNumber,
      onChange: onChangeNumber,
      activeClasses: !currentSettings.downloadPrettifyActive ? ['disabled'] : [],
      inactiveClasses: currentSettings.downloadPrettifyActive ? ['disabled'] : [],
    })]
  }]
  return renderFieldset(selection, data, 'item', 'item--prettify-svg')
}
