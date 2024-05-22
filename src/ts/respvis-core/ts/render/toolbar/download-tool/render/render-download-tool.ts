import {select, Selection} from "d3";
import downloadSVGRaw from '../../../../../../../assets/svg/download.svg'
import cancelSVGRaw from '../../../../../../../assets/svg/x-circle.svg'
import {Renderer} from "../../../chart/renderer";
import {addRawSVGToSelection} from "../../../../utilities/d3/util";
import {bindOpenerToDialog, DialogData, renderDialog} from "../../tool/render/render-dialog";
import {renderTool} from "../../tool/render/render-tool";
import {downloadChart} from "respvis-core/render/toolbar/download-tool/download-chart/download-chart";
import {renderButton} from "../../tool/render/render-button";
import {renderSimpleTooltip} from "../../tool/render/render-simple-tooltip";
import {inputLabelsRender} from "../../tool/input-label/input-labels-render";
import {renderStyleTypeOptions} from "./render-style-type-options";
import {renderAttributeRemovalOptions} from "./render-attribute-removal-options";
import {renderElementRemovalOptions} from "./render-element-removal-options";
import {renderDecimalNumberOptions} from "./render-decimal-number-options";
import {renderPrettifyOptions} from "./render-prettify-options";

export function renderDownloadTool(toolbarS: Selection<HTMLDivElement>, renderer: Renderer) {
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const downloadToolS = renderTool(contentS, 'tool--download')
  const dialogContainerS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__dialog-container')

  const dialogOpenerS = renderButton(downloadToolS, 'toolbar__btn')
  addRawSVGToSelection(dialogOpenerS, downloadSVGRaw)
  renderSimpleTooltip(dialogOpenerS, {text: 'Download'})
  const dialogS = renderDialog(dialogContainerS, 'dialog--center', 'dialog--download')
  bindOpenerToDialog({dialogOpenerS, dialogS, transitionMS: 300, type: 'modal'})

  renderPrettifyOptions(dialogS, renderer).call(inputLabelsRender)
  renderStyleTypeOptions(dialogS, renderer).call(inputLabelsRender)
  renderAttributeRemovalOptions(dialogS, renderer).call(inputLabelsRender)
  renderElementRemovalOptions(dialogS, renderer).call(inputLabelsRender)
  renderDecimalNumberOptions(dialogS, renderer).call(inputLabelsRender)
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
        .call((s) => downloadChart(s, 'chart.svg', renderer));
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
