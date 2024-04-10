import {select, Selection} from "d3";
import {ParcoordSeries} from "./parcoord-series";
import {Renderer} from "../../core/render/chart/renderer";
import {windowSettingsKeys} from "../../core/render/window/window-settings";
import {fieldsetRender} from "../../core/render/toolbar/tool/fieldset-render";
import {CheckBoxLabel} from "../../core/render/toolbar/tool/input-label/checkbox-label";
import {inputLabelsRender} from "../../core/render/toolbar/tool/input-label/input-labels-render";
import {DialogData} from "../../core/render/toolbar/tool/dialog-render";
import {addRawSVGToSelection} from "../../core/utilities/d3/util";
import checkSVGRaw from "../../core/assets/check.svg";

export function toolRender(toolbarS: Selection<HTMLDivElement>, series: ParcoordSeries) {
  const dialogS = toolbarS.selectAll<HTMLDialogElement, DialogData>('.dialog--center.dialog--chart')
  catchAxesOptionsRender(dialogS, series.renderer).call(inputLabelsRender)
  confirmButtonRender(dialogS)
}

function catchAxesOptionsRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const data = [{
    legend: 'Parallel Coordinates Settings',
    labelData: [ new CheckBoxLabel({
      label: 'Catch Axes on Drag & Drop',
      type: windowSettingsKeys.parcoordCatchAxes,
      defaultVal: currentSettings.parcoordCatchAxes,
      onChange,
    })
    ]
  }]
  return fieldsetRender(selection, data, 'item', 'item--parcoord-settings')
}

function confirmButtonRender(selection: Selection<HTMLDialogElement, DialogData>) {
  const buttonS = selection
    .selectAll<HTMLLIElement, any>('.button--icon.button--confirm')
    .data([null])
    .join('button')
    .classed('button--icon button--confirm', true)
    .on('click.confirm', function () {
      select<HTMLDialogElement, DialogData>(this.closest('dialog')!).datum()?.triggerExit()
    });

  buttonS.selectAll('span')
    .data([null])
    .join("span")
    .text('Ok')
  addRawSVGToSelection(buttonS, checkSVGRaw)
}
