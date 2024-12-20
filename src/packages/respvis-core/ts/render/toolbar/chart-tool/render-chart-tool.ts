import {select, Selection} from "d3";
import {renderTool} from "../tool/render/render-tool";
import {renderButton} from "../tool/render/render-button";
import chartSVGRaw from "../../../../../../assets/svg/tablericons/chart-settings.svg";
import {renderSimpleTooltip} from "../tool/render/render-simple-tooltip";
import {bindOpenerToDialog, DialogData, renderDialog} from "../tool/render/render-dialog";
import {DataSeries} from "../../data-series";
import {renderSVGSeries} from "../../element";

export function renderChartTool(toolbarS: Selection<HTMLDivElement>, seriesCollection: DataSeries[]) {
  if (seriesCollection.filter(series => series.renderTool).length <= 0) return

  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const chartToolS = renderTool(contentS, 'tool--chart')
  const dialogContainerS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__dialog-container')

  const dialogOpenerS = renderButton(chartToolS, 'toolbar__btn')
  renderSVGSeries(dialogOpenerS, [chartSVGRaw])
  renderSimpleTooltip(dialogOpenerS, {text: 'Chart Settings'})
  const dialogS = renderDialog(dialogContainerS, 'dialog--center', 'dialog--chart')
  bindOpenerToDialog({dialogOpenerS, dialogS, transitionMS: 300, type: 'modal'})

  dialogS.on('close', function (e) {
    e.preventDefault()
    seriesCollection[0]?.renderer.windowS.datum().settings.reset()
    select<HTMLDialogElement, DialogData>(this.closest('dialog')!).datum()?.triggerExit()
    seriesCollection[0]?.renderer.windowS.dispatch('resize')
  });

  seriesCollection.forEach(series => {
    series.renderTool?.(toolbarS)
  })
}
