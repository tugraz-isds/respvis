import {ChartPointValid} from "../../../points";
import {Selection} from "d3";
import {layouterRender} from "../../layouter";
import {updateCSSForSelection} from "../../data/breakpoint/breakpoint";
import {SVGHTMLElement} from "../../constants/types";
import {ChartWindowValid} from "./chart-window-validation";

export function chartWindowRender<D extends ChartWindowValid>(selection: Selection<SVGHTMLElement, D>) {
  const data = selection.datum()
  selection.datum(data)
    .classed('chart-window', true)
    .classed(`chart-window-${data.type}`, true)
  updateCSSForSelection(selection)

  const layouterS = selection
    .selectAll<HTMLDivElement, any>('.layouter')
    .data([data])
    .join('div')
    .call((s) => layouterRender(s));

  const chartS = layouterS
    .selectAll<SVGSVGElement, ChartPointValid>(`svg.chart-${data.type}`)
    .data([data])
    .join('svg')

  data.renderer.chartSelection = chartS
  return {chartWindowS: selection, layouterS, chartS}
}
