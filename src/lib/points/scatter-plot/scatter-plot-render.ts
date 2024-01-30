import {Selection} from 'd3';
import {chartBaseRender, chartCartesianAxisRender} from '../../core';
import {SeriesPointValid} from '../point-series/point-series-validation';
import {legendRender} from "../../core/render/legend";
import {ChartPointValid} from "./scatter-plot-validation";
import {pointSeriesRender} from "../point-series/point-series-render";
import {legendAddHover} from "../../core/render/legend/legend-event";

export type ScatterplotChartSelection = Selection<SVGSVGElement | SVGGElement, ChartPointValid>;

export function scatterPlotRender(selection: ScatterplotChartSelection) {
  const { legend } = selection.datum()
  chartBaseRender(selection).chart
    .classed('chart-point', true)
    .call(renderAllSeriesOfPoints)
  const legendS = legendRender(selection, legend)
  legendAddHover(legendS)
  selection.call(chartCartesianAxisRender)
}

function renderAllSeriesOfPoints(chartS: ScatterplotChartSelection) {
  const {series} = chartS.datum()
  chartS
    .selectAll('.draw-area')
    .selectAll<SVGSVGElement, ChartPointValid>('.series-point')
    .data<SeriesPointValid>([series])
    .join('svg')
    .call(pointSeriesRender)


  //TODO: improve this improvised label series
  // const points = seriesPointCreatePoints(pointSeries)
  // const labelData = seriesLabelData({
  //   positions: points.map((p) => {
  //     return {x: p.center.x + 13, y: p.center.y + 13}
  //   }),
  //   keys: points.map((p) => p.key),
  //   texts: points.map((p, markerI) =>
  //     p.radiusValue.toString() + '€'
  //   ),
  // });
  // chartS
  //   .selectAll('.draw-area')
  //   .selectAll<SVGGElement, SeriesLabel>('.series-label')
  //   .data([labelData])
  //   .join('g')
  //   .call((s) => seriesLabelRender(s));
}
