import {Selection} from "d3";
import {SVGHTMLElementLegacy} from "../../constants/types";
import {Window} from "./window";
import {layouterRender} from "../layouter";
import {renderTooltip} from "respvis-tooltip";
import {elementFromSelection} from "../../utilities";

export function renderWindow<D extends Window>(windowS: Selection<SVGHTMLElementLegacy, D>) {
  const data = windowS.datum()
  windowS.datum(data)
    .classed('window-rv', true)
    .classed(`window-rv-${data.type}`, true)

  data.breakpoints.updateCSSVars(elementFromSelection(windowS))

  const layouterS = windowS
    .selectAll<HTMLDivElement, any>('.layouter')
    .data([data])
    .join('div')
    .call((s) => layouterRender(s));

  const chartS = layouterS
    .selectAll<SVGSVGElement, D>(`svg.chart-${data.type}`)
    .data([data])
    .join('svg')

  if (data.tooltip.active) {
    renderTooltip()
  }

  return {chartWindowS: windowS, layouterS, chartS}
}
