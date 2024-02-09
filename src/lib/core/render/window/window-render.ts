import {Selection} from "d3";
import {layouterRender} from "../../layouter";
import {updateCSSForSelection} from "../../data/breakpoint/breakpoint";
import {SVGHTMLElement} from "../../constants/types";
import {WindowValid} from "./window-validation";

export function windowRender<D extends WindowValid>(selection: Selection<SVGHTMLElement, D>) {
  const data = selection.datum()
  selection.datum(data)
    .classed('window-rv', true)
    .classed(`window-rv-${data.type}`, true)
  updateCSSForSelection(selection)

  const layouterS = selection
    .selectAll<HTMLDivElement, any>('.layouter')
    .data([data])
    .join('div')
    .call((s) => layouterRender(s));

  const chartS = layouterS
    .selectAll<SVGSVGElement, D>(`svg.chart-${data.type}`)
    .data([data])
    .join('svg')

  data.renderer.chartSelection = chartS
  data.renderer.layouterSelection = layouterS
  return {chartWindowS: selection, layouterS, chartS}
}
