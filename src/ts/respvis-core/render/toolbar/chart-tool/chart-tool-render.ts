import {select, Selection} from "d3";
import {toolRender} from "../tool/tool-render";
import {buttonRender} from "../tool/button-render";
import {addRawSVGToSelection} from "../../../utilities/d3/util";
import chartSVGRaw from "../../../../../assets/svg/chart-bar.svg";
import {tooltipSimpleRender} from "../tool/tooltip-simple-render";
import {bindOpenerToDialog, DialogData, dialogRender} from "../tool/dialog-render";
import {Series} from "../../series";

export function chartToolRender(toolbarS: Selection<HTMLDivElement>, series: Series[]) {
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const downloadToolS = toolRender(contentS, 'tool--chart')
  const dialogContainerS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__dialog-container')

  const dialogOpenerS = buttonRender(downloadToolS, 'toolbar__btn')
  addRawSVGToSelection(dialogOpenerS, chartSVGRaw)
  tooltipSimpleRender(dialogOpenerS, {text: 'Chart Settings'})
  const dialogS = dialogRender(dialogContainerS, 'dialog--center', 'dialog--chart')
  bindOpenerToDialog({dialogOpenerS, dialogS, transitionMS: 300, type: 'modal'})

  dialogS.on('cancel', function (e) {
    e.preventDefault()
    select<HTMLDialogElement, DialogData>(this.closest('dialog')!).datum()?.triggerExit()
  });

  series.forEach(serie => {
    serie.toolRender(toolbarS)
  })
}
