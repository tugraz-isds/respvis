import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {CheckBoxLabel} from "../../tool/input-label/checkbox-label";
import {windowSettingsKeys} from "../../../window/window-settings";
import {renderFieldset} from "../../tool/render/render-fieldset";

export function renderAttributeRemovalOptions(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings.state
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const data = [{
    legend: 'Removal of Attributes',
    labelData: [new CheckBoxLabel({
      label: 'Remove Data Key Attributes',
      type: windowSettingsKeys.downloadRemoveDataKeys,
      defaultVal: currentSettings.downloadRemoveDataKeys,
      onChange,
    }), new CheckBoxLabel({
      label: 'Remove Class Attributes',
      type: windowSettingsKeys.downloadRemoveClasses,
      defaultVal: currentSettings.downloadRemoveClasses,
      onChange,
      activeClasses: currentSettings.downloadStyleType === 'embedded' ? ['disabled'] : [],
      inactiveClasses: [currentSettings.downloadStyleType !== 'embedded' ? 'disabled': ''],
    }), new CheckBoxLabel({
      label: 'Remove Data Style Attributes',
      type: windowSettingsKeys.downloadRemoveDataStyles,
      defaultVal: currentSettings.downloadRemoveDataStyles,
      onChange,
      activeClasses: currentSettings.downloadStyleType === 'embedded' ? ['disabled'] : [],
      inactiveClasses: [currentSettings.downloadStyleType !== 'embedded' ? 'disabled': ''],
    })
    ]
  }]
  return renderFieldset(selection, data, 'item', 'item--removal-attributes')
}
