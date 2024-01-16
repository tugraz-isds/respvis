import {Selection} from "d3";
import {chartBaseRender, chartCartesianAxisRender} from "../../core";
import {BarChartValid} from "./bar-chart-validation";

export type BarChartChartSelection = Selection<SVGSVGElement | SVGGElement, BarChartValid>;

export function barChartRender(selection: BarChartChartSelection) {
  chartBaseRender(selection).chart
    .classed('chart-bar', true)
    // .call(renderAllSeriesOfPoints)
    // .call(renderLegend)
  selection.call(chartCartesianAxisRender)
}
