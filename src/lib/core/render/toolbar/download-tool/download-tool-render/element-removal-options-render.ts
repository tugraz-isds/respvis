import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {CheckBoxLabel} from "../../tool/input-label/checkbox-label";
import {windowSettingsKeys} from "../../../window/window-settings";
import {fieldsetRender} from "../../tool/fieldset-render";

export function elementRemovalOptionsRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const data = [{
    legend: 'Removal of Elements',
    labelData: [new CheckBoxLabel({
      label: 'Remove Interactive Elements',
      type: windowSettingsKeys.downloadRemoveBgElements,
      defaultVal: currentSettings.downloadRemoveBgElements,
      onChange,
    })]
  }]
  return fieldsetRender(selection, data, 'item', 'item--removal-elements')
}
