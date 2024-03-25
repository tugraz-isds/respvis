import {Selection} from "d3";
import {SeriesChartValid} from "../chart/series-chart/series-chart-validation";
import {downloadToolRender} from "./download-tool/download-tool-render";
import {filterToolRender} from "./filter-tool/filter-tool-render";
import {crossToolRender} from "./cross-tool/cross-tool-render";
import {addRawSVGToSelection} from "../../utilities/d3/util";
import ChevronsDown from "../../assets/chevrons-down.svg"
import {DialogData} from "./tool/dialog-render";

export type ToolbarValid = Pick<SeriesChartValid, 'renderer' | 'legend' | 'getSeries' | 'getAxes'>

export function toolbarRender(chartS: Selection, args: ToolbarValid): void {
  const toolbarS = chartS
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .classed('toolbar', true)

  const toolbarContentS = toolbarS
    .selectAll<HTMLDivElement, any>('.toolbar__content')
    .data([null])
    .join('div')
    .classed('toolbar__content', true)

  const toolbarOpenerS = toolbarS
    .selectAll<HTMLDivElement, any>('.toolbar__opener')
    .data([null])
    .join('div')
    .classed('toolbar__opener', true)
    .on('click', () => {
      toolbarS.classed('visible', !toolbarS.classed('visible'))
    })

  addRawSVGToSelection(toolbarOpenerS, ChevronsDown)
  // toolbarOpenerS

  filterToolRender(toolbarContentS, args)
  downloadToolRender(toolbarContentS, args.renderer)
  crossToolRender(toolbarContentS, args.renderer)

  const dialogS = toolbarContentS.selectAll<HTMLDialogElement, DialogData>('dialog')
  dialogS.each(function (d, i) {
    const otherElements = dialogS.filter((d, j) => i !== j)
    d.onOpenerClick = () => {
      otherElements.each(d => d.triggerExit())
    }
  })
}
