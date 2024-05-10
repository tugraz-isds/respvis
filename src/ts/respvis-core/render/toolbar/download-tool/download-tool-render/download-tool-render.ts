import {select, Selection} from "d3";
import downloadSVGRaw from '../../../../assets/download.svg'
import cancelSVGRaw from '../../../../assets/x-circle.svg'
import {Renderer} from "../../../chart/renderer";
import {addRawSVGToSelection} from "../../../../utilities/d3/util";
import {bindOpenerToDialog, DialogData, dialogRender} from "../../tool/dialog-render";
import {toolRender} from "../../tool/tool-render";
import {chartDownload} from "../chart-download/chart-download";
import {buttonRender} from "../../tool/button-render";
import {tooltipSimpleRender} from "../../tool/tooltip-simple-render";
import {inputLabelsRender} from "../../tool/input-label/input-labels-render";
import {styleTypeOptionsRender} from "./style-options-render";
import {attributeRemovalOptionsRender} from "./attribute-removal-options-render";
import {elementRemovalOptionsRender} from "./element-removal-options-render";
import {decimalNumberOptionsRender} from "./decimal-number-options-render";
import {prettifyOptionsRender} from "./prettify-options-render";

export function downloadToolRender(toolbarS: Selection<HTMLDivElement>, renderer: Renderer) {
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const downloadToolS = toolRender(contentS, 'tool--download')
  const dialogContainerS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__dialog-container')

  const dialogOpenerS = buttonRender(downloadToolS, 'toolbar__btn')
  addRawSVGToSelection(dialogOpenerS, downloadSVGRaw)
  tooltipSimpleRender(dialogOpenerS, {text: 'Download'})
  const dialogS = dialogRender(dialogContainerS, 'dialog--center', 'dialog--download')
  bindOpenerToDialog({dialogOpenerS, dialogS, transitionMS: 300, type: 'modal'})

  prettifyOptionsRender(dialogS, renderer).call(inputLabelsRender)
  styleTypeOptionsRender(dialogS, renderer).call(inputLabelsRender)
  attributeRemovalOptionsRender(dialogS, renderer).call(inputLabelsRender)
  elementRemovalOptionsRender(dialogS, renderer).call(inputLabelsRender)
  decimalNumberOptionsRender(dialogS, renderer).call(inputLabelsRender)
  downloadButtonRender(dialogS, renderer)
  cancelButtonRender(dialogS)

  dialogS.on('cancel', function (e) {
    e.preventDefault()
    select<HTMLDialogElement, DialogData>(this.closest('dialog')!).datum()?.triggerExit()
  });
}

function downloadButtonRender(selection: Selection<HTMLDialogElement, DialogData>, renderer: Renderer) {
  const buttonS = selection
    .selectAll<HTMLLIElement, any>('.button--icon.button--download')
    .data([null])
    .join('button')
    .classed('button--icon button--download', true)
    .on('click', function () {
      select(this.closest('.window-rv'))
        .selectAll<SVGSVGElement, unknown>('.layouter > svg.chart')
        .call((s) => chartDownload(s, 'chart.svg', renderer));
      select<HTMLDialogElement, DialogData>(this.closest('dialog')!).datum()?.triggerExit()
    });

  buttonS.selectAll('span')
    .data([null])
    .join("span")
    .text('Download SVG')
  addRawSVGToSelection(buttonS, downloadSVGRaw)
}

function cancelButtonRender(selection: Selection<HTMLDialogElement, DialogData>) {
  const buttonS = selection
    .selectAll<HTMLLIElement, any>('.button--icon.button--cancel')
    .data([null])
    .join('button')
    .classed('button--icon button--cancel', true)
    .on('click.cancel', function () {
      select<HTMLDialogElement, DialogData>(this.closest('dialog')!).datum()?.triggerExit()
    });

  buttonS.selectAll('span')
    .data([null])
    .join("span")
    .text('Cancel')
  addRawSVGToSelection(buttonS, cancelSVGRaw)
}
