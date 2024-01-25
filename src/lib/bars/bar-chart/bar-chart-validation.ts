import {select, Selection} from 'd3';
import {
  chartBaseRender,
  chartCartesianAxisRender,
  ChartCartesianUserArgs,
  ChartCartesianValid,
  chartCartesianValidation
} from "../../core";
import {Bar, seriesBarRender, SeriesBarValid, seriesBarValidation} from "../bar-series/bar-series-validation";

export type BarChartArgs = ChartCartesianUserArgs & {
  // labelsEnabled: boolean;
  // labels: Partial<SeriesLabelBar>;
}

export type BarChartValid = ChartCartesianValid & {
  barSeries: SeriesBarValid
}

export interface BarChartValidation extends SeriesBarValid { //extends ChartCartesian
}

export function barChartValidation(chartArgs: BarChartArgs): BarChartValid {
  const {renderer, x, y, zoom,
    legend, bounds,
    title, subTitle
  } = chartArgs
  const series = seriesBarValidation({...chartArgs.series, key: 's-0', renderer})
  const cartesianData =
    chartCartesianValidation({renderer, series, x, y, zoom, legend, bounds, title, subTitle})
  return {
    ...cartesianData,
    barSeries: series
  }
}

export type ChartBarSelection = Selection<SVGSVGElement | SVGGElement, BarChartValid>;

export function chartBarRender(selection: ChartBarSelection): void {
  selection
    .call((s) => chartBaseRender(s))
    .classed('chart-bar', true)
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
      //           seriesLabelBarData({
      //             barContainer: barSeriesS,
      //             ...chartD.labels,
      //           }),
      //         ]
      //       : []
      //   )
      //   .join('g')
      //   .call((s) => seriesLabelBar(s));

      // chartD.xAxis.scale = chartD.categoryScale;
      // chartD.yAxis.scale = chartD.valueScale;
      chartCartesianAxisRender(chartS);
    });
}

export function chartBarHoverBar(chart: Selection, bar: Selection<Element, Bar>, hover: boolean) {
  bar.each((barD) => {
    chart.selectAll(`.label[data-key="${barD.key}"]`).classed('highlight', hover);
    chart.selectAll(`.axis-x .tick[data-key="${barD.category}"]`).classed('highlight', hover);
  });
}
