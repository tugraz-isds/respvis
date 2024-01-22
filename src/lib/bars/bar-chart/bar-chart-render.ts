import {select, Selection} from "d3";
import {chartBaseRender, chartCartesianAxisRender} from "../../core";
import {BarChartValid, chartBarHoverBar, ChartBarSelection} from "./bar-chart-validation";
import {legendRender} from "../../core/render/legend";
import {legendAddHover} from "../../core/render/legend/legend-event";
import {seriesBarRender, SeriesBarValid} from "../bar-series";

export type BarChartChartSelection = Selection<SVGSVGElement | SVGGElement, BarChartValid>;

export function barChartRender(selection: BarChartChartSelection) {
  const { legend } = selection.datum()
  chartBaseRender(selection).chart
    .classed('chart-bar', true)
    .call(renderBars)
  const legendS = legendRender(selection, legend)
  legendAddHover(legendS)
  selection.call(chartCartesianAxisRender)
}

export function renderBars(chartS: BarChartChartSelection) {
  chartS
    .each((chartD, i, g) => {
      const chartS = <ChartBarSelection>select(g[i]);
      const drawAreaS = chartS.selectAll('.draw-area');

      const barSeriesS = drawAreaS
        .selectAll<SVGGElement, SeriesBarValid>('.series-bar')
        .data([chartD.barSeries])
        .join('g')
        .call((s) => seriesBarRender(s))
        .on('pointerover.chartbarhighlight', (e) => chartBarHoverBar(chartS, select(e.target), true))
        .on('pointerout.chartbarhighlight', (e) => chartBarHoverBar(chartS, select(e.target), false));

      // drawAreaS
      //   .selectAll<Element, SeriesLabelBar>('.series-label-bar')
      //   .data(
      //     chartD.labelsEnabled
      //       ? [
      //         seriesLabelBarData({
      //           barContainer: barSeriesS,
      //           ...chartD.labels,
      //         }),
      //       ]
      //       : []
      //   )
      //   .join('g')
      //   .call((s) => seriesLabelBar(s));
    });
}
