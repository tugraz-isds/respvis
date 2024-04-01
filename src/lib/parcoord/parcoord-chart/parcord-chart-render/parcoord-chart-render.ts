import {chartRender} from "../../../core";
import {Selection} from "d3";
import {ParcoordChartValid} from "../parcoord-chart-validation";
import {renderLineSeries} from "./render-line-series";
import {renderAxisSeries} from "./render-axis-series";

export type ParcoordChartSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ParcoordChartValid>;

export function parCoordChartRender(selection: ParcoordChartSVGChartSelection) {
  chartRender(selection).chartS
    .classed('chart-parcoord', true)
    .call(renderLineSeries)
    .call(renderAxisSeries)
}

