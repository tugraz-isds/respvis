import {select, Selection} from "d3";
import {ParcoordSeries} from "../../parcoord-series/parcoord-series";
import {
  addRawSVGToSelection,
  CheckBoxLabel,
  DialogData,
  renderFieldset,
  renderInputLabels,
  WindowSettings,
  windowSettingsKeys
} from "respvis-core";
import checkSVGRaw from "../../../../../assets/svg/tablericons/check.svg";
import {onDragEndAxisParcoord} from "./on-drag-axis";

export function renderTool(toolbarS: Selection<HTMLDivElement>, series: ParcoordSeries) {
  const dialogS = toolbarS.selectAll<HTMLDialogElement, DialogData>('.dialog--center.dialog--chart')
  equidistantAxesOptionsRender(dialogS, series).call(renderInputLabels)
  confirmButtonRender(dialogS, series)
}

function equidistantAxesOptionsRender(selection: Selection, series: ParcoordSeries) {
  const {windowSettings} = series.renderer.windowS.datum()
  const onChange = (e: InputEvent, type: keyof WindowSettings) => {
    windowSettings.setDeferred(type, (e.target as HTMLInputElement).checked)
    // windowSettings[type] = (e.target as HTMLInputElement).checked
  }
  const defaultVal = windowSettings.snapshot['parcoordEquidistantAxes'] ??
    windowSettings.get('parcoordEquidistantAxes')

  const data = [{
    legend: 'Parallel Coordinates Settings',
    labelData: [ new CheckBoxLabel({
      label: 'Equidistant Axes',
      type: windowSettingsKeys.parcoordEquidistantAxes,
      defaultVal,
      onChange,
    })
    ]
  }]
  return renderFieldset(selection, data, 'item', 'item--parcoord-settings')
}

function confirmButtonRender(selection: Selection<HTMLDialogElement, DialogData>, series: ParcoordSeries) {
  const buttonS = selection
    .selectAll<HTMLLIElement, any>('.button--icon.button--confirm')
    .data([null])
    .join('button')
    .classed('button--icon button--confirm', true)
    .on('click.confirm', function () {
      series.renderer.windowS.datum().windowSettings.update()
      select<HTMLDialogElement, DialogData>(this.closest('dialog')!).datum()?.triggerExit()
      onDragEndAxisParcoord(series.axes[0])
    });

  buttonS.selectAll('span')
    .data([null])
    .join("span")
    .text('Ok')
  addRawSVGToSelection(buttonS, checkSVGRaw)
}
