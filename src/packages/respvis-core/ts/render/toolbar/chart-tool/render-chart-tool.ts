import {select, Selection} from "d3";
import {renderTool} from "../tool/render/render-tool";
import {renderButton} from "../tool/render/render-button";
import {addRawSVGToSelection} from "../../../utilities/d3/util";
import chartSVGRaw from "../../../../../../assets/svg/tablericons/chart-settings.svg";
import {renderSimpleTooltip} from "../tool/render/render-simple-tooltip";
import {bindOpenerToDialog, DialogData, renderDialog} from "../tool/render/render-dialog";
import {Series} from "../../series";

export function renderChartTool(toolbarS: Selection<HTMLDivElement>, seriesCollection: Series[]) {
  if (seriesCollection.filter(series => series.providesTool).length <= 0) return

  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const chartToolS = renderTool(contentS, 'tool--chart')
  const dialogContainerS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__dialog-container')

  const dialogOpenerS = renderButton(chartToolS, 'toolbar__btn')
  addRawSVGToSelection(dialogOpenerS, chartSVGRaw)
  renderSimpleTooltip(dialogOpenerS, {text: 'Chart Settings'})
  const dialogS = renderDialog(dialogContainerS, 'dialog--center', 'dialog--chart')
  bindOpenerToDialog({dialogOpenerS, dialogS, transitionMS: 300, type: 'modal'})

  dialogS.on('close', function (e) {
    e.preventDefault()
    seriesCollection[0]?.renderer.windowS.datum().windowSettings.reset()
    select<HTMLDialogElement, DialogData>(this.closest('dialog')!).datum()?.triggerExit()
    seriesCollection[0]?.renderer.windowS.dispatch('resize')
  });

  seriesCollection.forEach(series => {
    series.renderTool(toolbarS)
  })
}
