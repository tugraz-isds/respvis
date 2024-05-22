import {select, Selection} from "d3";
import {ParcoordSeries} from "../../parcoord-series/parcoord-series";
import {
  addRawSVGToSelection,
  CheckBoxLabel,
  DialogData,
  inputLabelsRender,
  Renderer,
  renderFieldset,
  windowSettingsKeys
} from "respvis-core";
import checkSVGRaw from "../../../../assets/svg/check.svg";

export function renderTool(toolbarS: Selection<HTMLDivElement>, series: ParcoordSeries) {
  const dialogS = toolbarS.selectAll<HTMLDialogElement, DialogData>('.dialog--center.dialog--chart')
  equidistantAxesOptionsRender(dialogS, series.renderer).call(inputLabelsRender)
  confirmButtonRender(dialogS)
}

function equidistantAxesOptionsRender(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().windowSettings
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).checked
    renderer.windowS.dispatch('resize')
  }

  const data = [{
    legend: 'Parallel Coordinates Settings',
    labelData: [ new CheckBoxLabel({
      label: 'Equidistant Axes',
      type: windowSettingsKeys.parcoordEquidistantAxes,
      defaultVal: currentSettings.parcoordEquidistantAxes,
      onChange,
    })
    ]
  }]
  return renderFieldset(selection, data, 'item', 'item--parcoord-settings')
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
