import {Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {Window} from "./window";
import {updateBreakpointStateForSelection} from "respvis-core/data/breakpoints/update-breakpoints";
import {layouterRender} from "respvis-core/layouter/layouter-compute";

export function renderWindow<D extends Window>(selection: Selection<SVGHTMLElement, D>) {
  const data = selection.datum()
  selection.datum(data)
    .classed('window-rv', true)
    .classed(`window-rv-${data.type}`, true)
  updateBreakpointStateForSelection(selection)

  const layouterS = selection
    .selectAll<HTMLDivElement, any>('.layouter')
    .data([data])
    .join('div')
    .call((s) => layouterRender(s));

  const chartS = layouterS
    .selectAll<SVGSVGElement, D>(`svg.chart-${data.type}`)
    .data([data])
    .join('svg')

  return {chartWindowS: selection, layouterS, chartS}
}
