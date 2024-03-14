import {Selection} from "d3";
import downloadSVGRaw from '../../../assets/download.svg'
import {RadioItemData, radioItemsRender} from "../tool/radio-items-render";
import {uniqueId} from "../../../utilities/unique";
import {Renderer} from "../../chart/renderer";
import {windowSettingsKeys} from "../../window/window-settings";
import {checkBoxItemsRender} from "./checkbox-items-render";
import {addRawSVGToSelection} from "../../../utilities/d3/util";
import {bindOpenerToDialog, dialogOpenerRender, dialogRender} from "../tool/dialog-render";
import {toolRender} from "../tool/tool-render";

export function downloadToolRender(selection: Selection<HTMLDivElement>, renderer: Renderer) {
  const downloadToolS = toolRender(selection, 'tool--download')

  const dialogOpenerS = dialogOpenerRender(downloadToolS)
  addRawSVGToSelection(dialogOpenerS, downloadSVGRaw)
  const dialogS = dialogRender(downloadToolS)
  bindOpenerToDialog(dialogOpenerS, dialogS)

  radioItemsBindData(dialogS, renderer)
    .call(radioItemsRender)

  checkBoxItemsBindData(dialogS)
    .call(checkBoxItemsRender)
}

function radioItemsBindData(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowSelection.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).value
    console.log(currentSettings)
  }
  const groupName = uniqueId()
  return selection.selectAll<any, RadioItemData>('.item.item--radio')
    .data([
      {
        legend: 'Style Type:',
        defaultVal: currentSettings.downloadStyleType,
        type: windowSettingsKeys.downloadStyleType,
        name: groupName,
        onChange,
        options: [
          { value: 'inline', label: 'Inline CSS'},
          { value: 'embedded', label: 'Embedded CSS'},
        ]
      }
    ])
    .join('fieldset')
    .classed('item item--radio', true)
}

function checkBoxItemsBindData(selection: Selection) {
  const items = [
    'Inline CSS',
    'Remove Data Key Attributes',
    'Remove Class Attributes (only for inline CSS)',
    'Remove Data Style Attributes (only for inline CSS)'
  ]

  return selection.selectAll('.item.item--checkbox')
    .data(items)
    .join('div')
    .classed('item item--checkbox', true)
}
