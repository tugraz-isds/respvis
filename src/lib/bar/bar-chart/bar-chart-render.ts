import {select, Selection} from "d3";
import {cartesianChartAxisRender, chartRender} from "../../core";
import {BarChartValid, chartBarHoverBar, ChartBarSelection} from "./bar-chart-validation";
import {legendRender} from "../../core/render/legend";
import {legendAddHover} from "../../core/render/legend/legend-event";
import {barSeriesRender, BarStandardSeries} from "../bar-series";

export type BarChartChartSelection = Selection<SVGSVGElement | SVGGElement, BarChartValid>;

export function barChartRender(selection: BarChartChartSelection) {
  const { legend } = selection.datum()
  const {chartS } = chartRender(selection)
  chartS.classed('chart-bar', true).call(renderBars)
  const legendS = legendRender(selection, legend)
  legendAddHover(legendS)
  chartS.call(cartesianChartAxisRender)
}

export function renderBars(chartS: BarChartChartSelection) {
  chartS
    .each((chartD, i, g) => {
      const chartS = <ChartBarSelection>select(g[i]);
      const drawAreaS = chartS.selectAll('.draw-area');

      drawAreaS
        .selectAll<SVGGElement, BarStandardSeries>('.series-bar')
        .data([chartD.series])
        .join('g')
        .call((s) => barSeriesRender(s))
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
