import {select, Selection} from 'd3';
import {rectFromString} from '../core';
import {chartCartesianAxesRender, chartCartesianRender,} from '../core/chart-cartesian';
import {SeriesPoint, seriesPointData, seriesPointRender} from './series-point';
import {Legend, legendRender} from "../legend";
import {ChartPointData} from "./chart-point-data";

export type ChartPointSelection = Selection<SVGSVGElement | SVGGElement, ChartPointData>;

export function chartPointRender(selection: ChartPointSelection): void {
  selection
    .call((s) => chartCartesianRender(s))
    .classed('chart-point', true)
    .each((chartD, i, g) => {
      setScale(chartD, g[i])
      renderAllSeriesOfPoints(chartD, g[i])
      renderLegend(chartD)

      chartD.xAxis.scale = chartD.xScale;
      chartD.yAxis.scale = chartD.yScale;
    })
    .call((s) => chartCartesianAxesRender(s));

  function setScale (data: ChartPointData, g: SVGSVGElement | SVGGElement) {
    const drawAreaS = select(g).selectAll('.draw-area');
    const drawAreaBounds = rectFromString(drawAreaS.attr('bounds') || '0, 0, 600, 400');
    const { flipped, xScale, yScale } = data;

    xScale.range(flipped ? [drawAreaBounds.height, 0] : [0, drawAreaBounds.width]);
    yScale.range(flipped ? [0, drawAreaBounds.width] : [drawAreaBounds.height, 0]);
  }

  function renderAllSeriesOfPoints (data: ChartPointData, g: SVGSVGElement | SVGGElement) {
    const { flipped, pointSeries, xScale, yScale } = data;
    select(g)
      .selectAll('.draw-area')
      .selectAll<SVGSVGElement, ChartPointData>('.series-point')
      .data<SeriesPoint>(
      pointSeries.map((p) =>
        seriesPointData({
          styleClasses: p.styleClasses,
          keys: p.keys,
          xValues: p.xValues,
          yValues: p.yValues,
          radiuses: p.radiuses,
          xScale, yScale, flipped
        })
      )).join('svg')
      .call((s) => seriesPointRender(s))
  }

  function renderLegend(chartD: ChartPointData) {
    const {legend} = chartD
    selection
      .selectAll<SVGGElement, Legend>('.legend')
      .data([legend])
      .join('g')
      .call((s) => legendRender(s))
    // .on('pointerover.chartlinehighlight pointerout.chartlinehighlight', (e) => { //TODO: Hover
    //   chartLineHoverLegendItem(
    //     drawAreaS,
    //     select(e.target.closest('.legend-item')),
    //     e.type.endsWith('over')
    //   );
    // });
  }
}
