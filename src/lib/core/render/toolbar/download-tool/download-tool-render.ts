import {Selection} from "d3";
import downloadSVGRaw from '../../../assets/download.svg'
import {radioLabelsRender} from "../tool/radio-labels-render";
import {uniqueId} from "../../../utilities/unique";
import {Renderer} from "../../chart/renderer";
import {windowSettingsKeys} from "../../window/window-settings";
import {checkBoxLabelsRender} from "./check-box-labels-render";
import {addRawSVGToSelection} from "../../../utilities/d3/util";
import {bindOpenerToDialog, dialogOpenerRender, dialogRender} from "../tool/dialog-render";
import {toolRender} from "../tool/tool-render";
import {fieldsetRender} from "../tool/fieldset-render";

export function downloadToolRender(selection: Selection<HTMLDivElement>, renderer: Renderer) {
  const downloadToolS = toolRender(selection, 'tool--download')

  const dialogOpenerS = dialogOpenerRender(downloadToolS)
  addRawSVGToSelection(dialogOpenerS, downloadSVGRaw)
  const dialogS = dialogRender(downloadToolS)
  bindOpenerToDialog(dialogOpenerS, dialogS)

  radioItemRender(dialogS, renderer)
    .call(radioLabelsRender)

  checkBoxSeriesItemRender(dialogS, renderer)
    .call(checkBoxLabelsRender)
}

function radioItemRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowSelection.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).value
    renderer.windowSelection.dispatch('resize')
  }
  const groupName = uniqueId()
  const data = [{
      legend: 'Style Type:',
      defaultVal: currentSettings.downloadStyleType,
      type: windowSettingsKeys.downloadStyleType,
      name: groupName,
      onChange,
      options: [
        {value: 'inline', label: 'Inline CSS'},
        {value: 'embedded', label: 'Embedded CSS'},
      ]
  }]
  return fieldsetRender(selection, data, 'item', 'item--radio')
}

function checkBoxSeriesItemRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowSelection.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowSelection.dispatch('resize')
  }

// .classed('item--disabled', currentSettings.downloadStyleType !== 'inline')

  const data = [{
    legend: 'Removal of Attributes',
    labelData: [
      {
        label: 'Remove Data Key Attributes',
        type: windowSettingsKeys.downloadRemoveDataKeys,
        defaultVal: currentSettings.downloadRemoveDataKeys,
        onChange,
      }, {
        label: 'Remove Class Attributes (only for inline CSS)',
        type: windowSettingsKeys.downloadRemoveClasses,
        defaultVal: currentSettings.downloadRemoveClasses,
        onChange,
        class: currentSettings.downloadStyleType === 'embedded' ? 'disabled' : ''
      }, {
        label: 'Remove Data Style Attributes (only for inline CSS)',
        type: windowSettingsKeys.downloadRemoveDataStyles,
        defaultVal: currentSettings.downloadRemoveDataStyles,
        onChange,
        class: currentSettings.downloadStyleType === 'embedded' ? 'disabled' : ''
      }
    ]
  }]
  return fieldsetRender(selection, data, 'item', 'item--checkbox-series')
}
