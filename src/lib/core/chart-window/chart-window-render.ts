import {ChartPointData} from "../../points";
import {Selection} from "d3";
import {toolbarRender} from "../charts/chart-base";
import {toolDownloadSVGRender} from "../tools/tool-download-svg";
import {layouterRender} from "../layouter";
import {updateCSSForSelection} from "../utilities/resizing/bounds";
import {resizeEventListener} from "../resize-event-dispatcher";
import {SVGHTMLElement} from "../constants/types";
import {ChartWindowValid} from "./chart-window-validation";

export function renderChartWindow<D extends ChartWindowValid>(selection: Selection<SVGHTMLElement, D>, data: D) {
  selection
    .datum(data)
    .classed('chart-window', true)
    .classed(`chart-window-${data.type}`, true)

  updateCSSForSelection(selection)

  const toolbarS = selection
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .call((s) => toolbarRender(s));

  const menuItemsS = selection.selectAll('.menu-tools > .items')
    .selectAll<HTMLLIElement, any>('.tool-download-svg')
    .data([null])
    .join('li')
    .call((s) => toolDownloadSVGRender(s));

  const layouterS = selection
    .selectAll<HTMLDivElement, any>('.layouter')
    .data([data])
    .join('div')
    .call((s) => layouterRender(s));

  const chartS = layouterS
    .selectAll<SVGSVGElement, ChartPointData>(`svg.chart-${data.type}`)
    .data([data])
    .join('svg')

  resizeEventListener(selection);
  return {chartWindowS: selection, menuItemsS, layouterS, chartS, toolbarS}
}
