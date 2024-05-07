import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {CheckBoxLabel} from "../../tool/input-label/checkbox-label";
import {windowSettingsKeys} from "../../../window/window-settings";
import {fieldsetRender} from "../../tool/fieldset-render";

export function prettifyOptionsRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const data = [{
    legend: 'Prettify SVG',
    labelData: [new CheckBoxLabel({
      label: 'Prettify SVG',
      type: windowSettingsKeys.downloadPrettifyActive,
      defaultVal: currentSettings.downloadPrettifyActive,
      onChange,
    })]
  }]
  return fieldsetRender(selection, data, 'item', 'item--prettify-svg')
}
