import {Selection} from "d3";
import {addLegendHoverHighlighting, renderChart, renderLegend} from "respvis-core";
import {LineChartData} from "./validate-line-chart";
import {LineSeries} from "../line-series/line-series-validation";
import {renderLineSeries} from "../line-series/render-line-series";

export type LineChartSVGChartSelection = Selection<SVGSVGElement | SVGGElement, LineChartData>;

export function renderLineChart(selection: LineChartSVGChartSelection) {
  const { legend } = selection.datum()
  renderChart(selection).chartS
    .classed('chart-line', true)
    .call(renderAllSeriesOfLines)
  const legendS = renderLegend(selection, legend)
  addLegendHoverHighlighting(legendS)
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
  chartS.selectAll<SVGSVGElement, LineSeries>('.series-line , .series-point-line').call(renderLineSeries)
}
