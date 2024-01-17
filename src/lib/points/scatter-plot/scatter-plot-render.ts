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
  const {pointSeries} = chartS.datum()
  chartS
    .selectAll('.draw-area')
    .selectAll<SVGSVGElement, ChartPointValid>('.series-point')
    .data<SeriesPointValid>([pointSeries])
    .join('svg')
    .call(pointSeriesRender)
}
