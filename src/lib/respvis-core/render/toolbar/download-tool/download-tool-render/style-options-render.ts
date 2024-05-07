import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {windowSettingsKeys} from "../../../window/window-settings";
import {uniqueId} from "../../../../utilities/unique";
import {RadioLabel} from "../../tool/input-label/radio-label";
import {fieldsetRender} from "../../tool/fieldset-render";

export function styleTypeOptionsRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).value
    renderer.windowS.dispatch('resize')
  }
  const sharedData = {
    defaultVal: currentSettings.downloadStyleType,
    type: windowSettingsKeys.downloadStyleType,
    name: uniqueId(),
    onChange,
  }
  const data = [{
    legend: 'Style Type:',
    labelData: [
      new RadioLabel({...sharedData, value: 'inline', label: 'Inline CSS'}),
      new RadioLabel({...sharedData, value: 'embedded', label: 'Embedded CSS'}),
    ]
  }]
  return fieldsetRender(selection, data, 'item', 'item--radio')
}
