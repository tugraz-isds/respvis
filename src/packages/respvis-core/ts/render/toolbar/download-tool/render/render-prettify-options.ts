import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {CheckBoxLabel} from "../../tool/input-label/checkbox-label";
import {windowSettingsKeys} from "../../../window/window-settings";
import {renderFieldset} from "../../tool/render/render-fieldset";
import {NumberLabel} from "../../tool/input-label/number-label";
import {validateNumberLabel} from "../../../../utilities/dom/validateInputs";

export function renderPrettifyOptions(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().settings.state
  const onChange = (e: InputEvent, type: string) => {
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
    legend: 'Prettify SVG',
    labelData: [new CheckBoxLabel({
      label: 'Prettify SVG',
      type: windowSettingsKeys.downloadPrettifyActive,
      defaultVal: currentSettings.downloadPrettifyActive,
      onChange,
    }), new NumberLabel({
      label: 'Indentation spaces',
      type: windowSettingsKeys.downloadPrettifyIndentionSpaces,
      initialValue: currentSettings.downloadPrettifyIndentionSpaces,
      min: 1, max: 20, step: 1, size: 2,
      onChange: onChangeNumber,
      activeClasses: !currentSettings.downloadPrettifyActive ? ['disabled'] : [],
      inactiveClasses: currentSettings.downloadPrettifyActive ? ['disabled'] : [],
    })]
  }]
  return renderFieldset(selection, data, 'item', 'item--prettify-svg')
}
