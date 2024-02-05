import {Selection} from 'd3';
import {chartBaseRender, chartCartesianAxisRender} from '../../core';
import {PointSeries} from '../point-series/point-series-validation';
import {legendRender} from "../../core/render/legend";
import {ScatterPlotValid} from "./scatter-plot-validation";
import {pointSeriesRender} from "../point-series/point-series-render";
import {legendAddHover} from "../../core/render/legend/legend-event";

export type ScatterplotSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ScatterPlotValid>;

export function scatterPlotRender(selection: ScatterplotSVGChartSelection) {
  const { legend } = selection.datum()
  chartBaseRender(selection).chart
    .classed('chart-point', true)
    .call(renderAllSeriesOfPoints)
  const legendS = legendRender(selection, legend)
  legendAddHover(legendS)
  selection.call(chartCartesianAxisRender)
}

function renderAllSeriesOfPoints(chartS: ScatterplotSVGChartSelection) {
  const {series} = chartS.datum()
  chartS
    .selectAll('.draw-area')
    .selectAll<SVGSVGElement, ScatterPlotValid>('.series-point')
    .data<PointSeries>([series])
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
