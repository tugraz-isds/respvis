import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {CheckBoxLabel} from "../../tool/input-label/checkbox-label";
import {windowSettingsKeys} from "../../../window/window-settings";
import {renderFieldset} from "../../tool/render/render-fieldset";

export function renderElementRemovalOptions(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().settings.state
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
  return renderFieldset(selection, data, 'item', 'item--removal-elements')
}
