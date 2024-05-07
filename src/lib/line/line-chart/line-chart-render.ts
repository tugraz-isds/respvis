import {Selection} from "d3";
import {legendRender} from "respvis-core/render/legend";
import {legendAddHover} from "respvis-core/render/legend/legend-event";
import {LineChartValid} from "./line-chart-validation";
import {LineSeries} from "../line-series/line-series-validation";
import {lineSeriesRender} from "../line-series/line-series-render";
import {chartRender} from "respvis-core";

export type LineChartSVGChartSelection = Selection<SVGSVGElement | SVGGElement, LineChartValid>;

export function lineChartRender(selection: LineChartSVGChartSelection) {
  const { legend } = selection.datum()
  chartRender(selection).chartS
    .classed('chart-line', true)
    .call(renderAllSeriesOfLines)
  const legendS = legendRender(selection, legend)
  legendAddHover(legendS)
}

function renderAllSeriesOfLines(chartS: LineChartSVGChartSelection) {
  const series = chartS.datum().series.cloneZoomed().cloneFiltered() as LineSeries
  const drawAreaS = chartS.datum().renderer.drawAreaS
  const createSelection = (type: 'line' | 'point-line') => {
    return drawAreaS
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
