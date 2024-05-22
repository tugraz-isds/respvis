import {renderChart} from "respvis-core";
import {Selection} from "d3";
import {ParcoordChartData} from "../validate-parcoord-chart";
import {renderLineSeriesParcoord} from "./render-line-series";
import {renderAxisSeries} from "./render-axis-series";

export type ParcoordChartSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ParcoordChartData>;

export function renderParcoordChart(selection: ParcoordChartSVGChartSelection) {
  renderChart(selection).chartS
    .classed('chart-parcoord', true)
    .call(renderLineSeriesParcoord)
    .call(renderAxisSeries)
}

