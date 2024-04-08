import {select, Selection} from "d3";
import downloadSVGRaw from '../../../assets/download.svg'
import {RadioLabel} from "../tool/input-label/radio-label";
import {uniqueId} from "../../../utilities/unique";
import {Renderer} from "../../chart/renderer";
import {windowSettingsKeys} from "../../window/window-settings";
import {CheckBoxLabel} from "../tool/input-label/checkbox-label";
import {addRawSVGToSelection} from "../../../utilities/d3/util";
import {bindOpenerToDialog, dialogRender} from "../tool/dialog-render";
import {toolRender} from "../tool/tool-render";
import {fieldsetRender} from "../tool/fieldset-render";
import {chartDownload} from "./chart-download/chart-download";
import {buttonRender} from "../tool/button-render";
import {tooltipSimpleRender} from "../tool/tooltip-simple-render";
import {inputLabelsRender} from "../tool/input-label/input-labels-render";
import {NumberLabel} from "../tool/input-label/number-label";

export function downloadToolRender(toolbarS: Selection<HTMLDivElement>, renderer: Renderer) {
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const downloadToolS = toolRender(contentS, 'tool--download')
  const dialogContainerS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__dialog-container')

  const dialogOpenerS = buttonRender(downloadToolS, 'toolbar__btn')
  addRawSVGToSelection(dialogOpenerS, downloadSVGRaw)
  tooltipSimpleRender(dialogOpenerS, {text: 'Download'})
  const dialogS = dialogRender(dialogContainerS, 'dialog--side', 'dialog--download')
  bindOpenerToDialog(dialogOpenerS, dialogS)

  styleTypeOptionsRender(dialogS, renderer).call(inputLabelsRender)
  attributeRemovalOptionsRender(dialogS, renderer).call(inputLabelsRender)
  elementRemovalOptionsRender(dialogS, renderer).call(inputLabelsRender)
  decimalNumberOptionsRender(dialogS, renderer).call(inputLabelsRender)
  downloadButtonRender(dialogS, renderer)
}

function styleTypeOptionsRender(selection: Selection, renderer: Renderer) {
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

function attributeRemovalOptionsRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const data = [{
    legend: 'Removal of Attributes',
    labelData: [ new CheckBoxLabel({
      label: 'Remove Data Key Attributes',
      type: windowSettingsKeys.downloadRemoveDataKeys,
      defaultVal: currentSettings.downloadRemoveDataKeys,
      onChange,
    }), new CheckBoxLabel({
      label: 'Remove Class Attributes (only for inline CSS)',
      type: windowSettingsKeys.downloadRemoveClasses,
      defaultVal: currentSettings.downloadRemoveClasses,
      onChange,
      class: currentSettings.downloadStyleType === 'embedded' ? 'disabled' : ''
    }), new CheckBoxLabel({
      label: 'Remove Data Style Attributes (only for inline CSS)',
      type: windowSettingsKeys.downloadRemoveDataStyles,
      defaultVal: currentSettings.downloadRemoveDataStyles,
      onChange,
      class: currentSettings.downloadStyleType === 'embedded' ? 'disabled' : ''
    })
    ]
  }]
  return fieldsetRender(selection, data, 'item', 'item--removal-attributes')
}

function elementRemovalOptionsRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const data = [{
    legend: 'Removal of Elements',
    labelData: [ new CheckBoxLabel({
      label: 'Remove Background Elements',
      type: windowSettingsKeys.downloadRemoveBgElements,
      defaultVal: currentSettings.downloadRemoveBgElements,
      onChange,
    })]
  }]
  return fieldsetRender(selection, data, 'item', 'item--removal-elements')
}

function decimalNumberOptionsRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChangeActive = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const onNumberInput = (e, d: NumberLabel) => {
    const type = d.data.type
    const target = e.target as HTMLInputElement
    const value = parseInt(target.value)
    if (isNaN(value)) e.target.value = currentSettings[type]
  }
  const onChangeNumber = (e, d: NumberLabel) => {
    const type = d.data.type
    const target = e.target as HTMLInputElement
    const value = parseInt(target.value)
    if (isNaN(value) || (d.data.min && value < d.data.min) || (d.data.max && value > d.data.max)) {
      e.target.value = currentSettings[type]
    }
    currentSettings[d.data.type] = (e.target as HTMLInputElement).value
  }

  const data = [{
    legend: 'Decimal Count of Attributes',
    labelData: [ new CheckBoxLabel({
        label: 'Reduce Decimals',
        type: windowSettingsKeys.downloadAttributeMaxDecimalsActive,
        defaultVal: currentSettings.downloadAttributeMaxDecimalsActive,
        onChange: onChangeActive,
      }), new NumberLabel({
      label: 'Decimal Count',
      type: windowSettingsKeys.downloadAttributeMaxDecimals,
      value: currentSettings.downloadAttributeMaxDecimals,
      min: 1, max: 20, step: 1,
      onInput: onNumberInput,
      onChange: onChangeNumber,
      class: !currentSettings.downloadAttributeMaxDecimalsActive ? 'disabled' : ''
    })
    ]
  }]
  return fieldsetRender(selection, data, 'item', 'item--decimal-options')
}

function downloadButtonRender(selection: Selection, renderer: Renderer) {
  const buttonS = selection
    .selectAll<HTMLLIElement, any>('.button--icon')
    .data([null])
    .join('button')
    .classed('button--icon', true)
    .on('click', function () {
      select(this.closest('.window-rv'))
        .selectAll<SVGSVGElement, unknown>('.layouter > svg.chart')
        .call((s) => chartDownload(s, 'chart.svg', renderer));
    });

  buttonS.selectAll('span')
    .data([null])
    .join("span")
    .text('Download SVG')
  addRawSVGToSelection(buttonS, downloadSVGRaw)
}
