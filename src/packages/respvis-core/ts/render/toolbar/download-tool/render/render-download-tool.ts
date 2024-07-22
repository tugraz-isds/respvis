import {select, Selection} from "d3";
import downloadSVGRaw from '../../../../../../../assets/svg/tablericons/download.svg'
import cancelSVGRaw from '../../../../../../../assets/svg/feathericons/x-circle.svg'
import {Renderer} from "../../../chart/renderer";
import {bindOpenerToDialog, DialogData, renderDialog} from "../../tool/render/render-dialog";
import {renderTool} from "../../tool/render/render-tool";
import {downloadChart} from "../download-chart/download-chart";
import {renderButton} from "../../tool/render/render-button";
import {renderSimpleTooltip} from "../../tool/render/render-simple-tooltip";
import {renderInputLabels} from "../../tool/input-label/render-input-labels";
import {renderStyleTypeOptions} from "./render-style-type-options";
import {renderAttributeRemovalOptions} from "./render-attribute-removal-options";
import {renderDecimalNumberOptions} from "./render-decimal-number-options";
import {renderPrettifyOptions} from "./render-prettify-options";
import {renderMarginOptions} from "./render-margin-options";
import {renderSVGSeries} from "../../../element/svg-series";

export function renderDownloadTool(toolbarS: Selection<HTMLDivElement>, renderer: Renderer) {
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const downloadToolS = renderTool(contentS, 'tool--download')
  const dialogContainerS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__dialog-container')

  const dialogOpenerS = renderButton(downloadToolS, 'toolbar__btn')
  renderSVGSeries(dialogOpenerS, [downloadSVGRaw])
  renderSimpleTooltip(dialogOpenerS, {text: 'Download'})
  const dialogS = renderDialog(dialogContainerS, 'dialog--center', 'dialog--download')
  bindOpenerToDialog({dialogOpenerS, dialogS, transitionMS: 300, type: 'modal'})

  renderMarginOptions(dialogS, renderer).call(renderInputLabels)
  renderPrettifyOptions(dialogS, renderer).call(renderInputLabels)
  renderStyleTypeOptions(dialogS, renderer).call(renderInputLabels)
  renderAttributeRemovalOptions(dialogS, renderer).call(renderInputLabels)
  // renderElementRemovalOptions(dialogS, renderer).call(renderInputLabels)
  renderDecimalNumberOptions(dialogS, renderer).call(renderInputLabels)
  downloadButtonRender(dialogS, renderer)
  cancelButtonRender(dialogS)
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
  renderSVGSeries(buttonS, [downloadSVGRaw])
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
  renderSVGSeries(buttonS, [cancelSVGRaw])
}
