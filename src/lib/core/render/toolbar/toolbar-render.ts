import {Selection} from "d3";
import {SeriesChartValid} from "../chart/series-chart/series-chart-validation";
import {downloadToolRender} from "./download-tool/download-tool-render";
import {filterToolRender} from "./filter-tool/filter-tool-render";
import {crossToolRender} from "./cross-tool/cross-tool-render";

export type ToolbarValid = Pick<SeriesChartValid, 'renderer' | 'legend' | 'getSeries' | 'getAxes'>

export function toolbarRender(chartS: Selection, args: ToolbarValid): void {
  const toolbarS = chartS
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .classed('toolbar', true)

  filterToolRender(toolbarS, args)
  downloadToolRender(toolbarS, args.renderer)
  crossToolRender(toolbarS, args.renderer)
}
