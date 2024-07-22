import {Selection} from "d3";
import {SeriesChartData} from "../chart/series-chart/series-chart";
import {renderDownloadTool} from "./download-tool";
import {renderFilterTool} from "./filter-tool/render-filter-tool";
import {renderCrossTool} from "./cross-tool/render-cross-tool";
import ChevronsDown from "../../../../../assets/svg/tablericons/chevrons-down.svg"
import {DialogData} from "./tool/render/render-dialog";
import {clickSAddEnterExitAttributes} from "./tool/animation/animtation";
import {renderChartTool} from "./chart-tool/render-chart-tool";
import {renderSVGSeries} from "../element/svg-series";

export type Toolbar = Pick<SeriesChartData, 'renderer' | 'getSeries' | 'getAxes'>

export function renderToolbar(windowS: Selection, args: Toolbar) {
  const toolbarS = windowS
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .classed('toolbar', true)

  const toolbarBarS = toolbarS
    .selectAll<HTMLDivElement, any>('.toolbar__bar')
    .data([null])
    .join('div')
    .classed('toolbar__bar', true)

  toolbarBarS
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
  clickSAddEnterExitAttributes(toolbarOpenerS, toolbarS, 600)

  toolbarS
    .selectAll<HTMLDivElement, any>('.toolbar__dialog-container')
    .data([null])
    .join('div')
    .classed('toolbar__dialog-container', true)

  renderSVGSeries(toolbarOpenerS, [ChevronsDown])

  renderFilterTool(toolbarS, args)
  renderDownloadTool(toolbarS, args.renderer)
  renderCrossTool(toolbarS, args.getSeries())
  renderChartTool(toolbarS, args.getSeries())

  const dialogS = toolbarS.selectAll<HTMLDialogElement, DialogData>('dialog')

  dialogS.each(function (d, i) {
    const otherElements = dialogS.filter((d, j) => i !== j)
    d.onOpenerClick = () => {
      otherElements.each(d => d.triggerExit())
    }
  })

  toolbarOpenerS.on('click.close', () => {
    dialogS.each((d) => d.triggerExit())
  })
}
