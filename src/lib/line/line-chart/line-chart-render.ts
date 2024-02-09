import {Selection} from "d3";
import {chartCartesianAxisRender, chartRender} from "../../core";
import {legendRender} from "../../core/render/legend";
import {legendAddHover} from "../../core/render/legend/legend-event";
import {LineChartValid} from "./line-chart-validation";
import {LineSeries} from "../line-series/line-series-validation";
import {lineSeriesRender} from "../line-series/line-series-render";

export type LineChartSVGChartSelection = Selection<SVGSVGElement | SVGGElement, LineChartValid>;

export function lineChartRender(selection: LineChartSVGChartSelection) {
  const { legend } = selection.datum()
  chartRender(selection).chartS
    .classed('chart-line', true)
    .call(renderAllSeriesOfLines)
  const legendS = legendRender(selection, legend)
  legendAddHover(legendS)
  selection.call(chartCartesianAxisRender)
}

function renderAllSeriesOfLines(chartS: LineChartSVGChartSelection) {
  const {series} = chartS.datum()
  const createSelection = (type: 'line' | 'point-line') => {
    return chartS.selectAll('.draw-area')
      .selectAll<SVGSVGElement, LineSeries>(`.series-${type}`)
      .data<LineSeries>([series])
      .join('g')
      .classed(`series-${type}`, true)
      .attr('data-ignore-layout-children', true)
  }

  createSelection('line')
  createSelection('point-line')
  chartS.selectAll<SVGSVGElement, LineSeries>('.series-line , .series-point-line').call(lineSeriesRender)
}
