import {chartBaseRender} from "../../core";
import {Selection} from "d3";
import {ParcoordChartValid} from "./parcoord-chart-validation";

export type ParcoordChartSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ParcoordChartValid>;

export function parCoordChartRender(selection: ParcoordChartSVGChartSelection) {
  // const { legend } = selection.datum()
  chartBaseRender(selection).chart
    .classed('chart-parcoord', true)
    // .call(renderAllSeriesOfPoints)
  // const legendS = legendRender(selection, legend)
  // legendAddHover(legendS)
  // selection.call(chartCartesianAxisRender)
}
