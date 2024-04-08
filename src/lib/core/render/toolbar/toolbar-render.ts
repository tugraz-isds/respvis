import {Selection} from "d3";
import {SeriesChartValid} from "../chart/series-chart/series-chart-validation";
import {downloadToolRender} from "./download-tool/download-tool-render";
import {filterToolRender} from "./filter-tool/filter-tool-render";
import {crossToolRender} from "./cross-tool/cross-tool-render";
import {addRawSVGToSelection} from "../../utilities/d3/util";
import ChevronsDown from "../../assets/chevrons-down.svg"
import {DialogData} from "./tool/dialog-render";
import {clickSAddEnterExitAttributes} from "./tool/animation/animtation";

export type ToolbarValid = Pick<SeriesChartValid, 'renderer' | 'legend' | 'getSeries' | 'getAxes'>

export function toolbarRender(chartS: Selection, args: ToolbarValid): void {
  const toolbarS = chartS
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .classed('toolbar', true)

  const toolbarBarS = toolbarS
    .selectAll<HTMLDivElement, any>('.toolbar__bar')
    .data([null])
    .join('div')
    .classed('toolbar__bar', true)

  const toolbarContentS = toolbarBarS
    .selectAll<HTMLDivElement, any>('.toolbar__content-wrapper')
    .data([null])
    .join('div')
    .classed('toolbar__content-wrapper', true)
    .selectAll<HTMLDivElement, any>('.toolbar__content')
    .data([null])
    .join('div')
    .classed('toolbar__content', true)

  const toolbarOpenerS = toolbarBarS
    .selectAll<HTMLDivElement, any>('.toolbar__opener')
    .data([null])
    .join('div')
    .classed('toolbar__opener', true)
  clickSAddEnterExitAttributes(toolbarOpenerS, toolbarS, 800)

  const dialogContainerS = toolbarS
    .selectAll<HTMLDivElement, any>('.toolbar__dialog-container')
    .data([null])
    .join('div')
    .classed('toolbar__dialog-container', true)

  addRawSVGToSelection(toolbarOpenerS, ChevronsDown)

  filterToolRender(toolbarS, args)
  downloadToolRender(toolbarS, args.renderer)
  crossToolRender(toolbarS, args.renderer)

  const dialogS = toolbarS.selectAll<HTMLDialogElement, DialogData>('dialog')
  dialogS.each(function (d, i) {
    const otherElements = dialogS.filter((d, j) => i !== j)
    d.onOpenerClick = () => {
      otherElements.each(d => d.triggerExit())
    }
  })
}
