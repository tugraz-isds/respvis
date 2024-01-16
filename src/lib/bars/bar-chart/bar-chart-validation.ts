import { select, Selection } from 'd3';
import {
  ChartCartesianArgs,
  chartCartesianAxisRender,
  chartCartesianValidation,
  ChartCartesianValid,
  ScaleContinuous
} from "../../core";
import { seriesBarRender, seriesBarData, SeriesBar, Bar } from '../series-bar';
import {
  SeriesLabelBar as SeriesLabelBar,
  seriesLabelBarData as seriesLabelBarData,
  seriesLabelBar,
} from '../series-label-bar';
import {chartBaseRender} from "../../core";
import {seriesPointData, SeriesPointValid} from "../../points";

export type BarChartArgs = ChartCartesianArgs & {
  // labelsEnabled: boolean;
  // labels: Partial<SeriesLabelBar>;
}

export type BarChartValid = ChartCartesianValid & {
}

export interface BarChartValidation extends SeriesBar { //extends ChartCartesian

}

export function barChartValidation(data: BarChartArgs): BarChartValid {
  //TODO create bar series
  // const pointSeries = seriesPointData({
  //   ...(markerTooltips ?? {}),
  //   flipped, x, y, color, radii, legend, key: '0', renderer: data.renderer
  // })
  return {
    ...chartCartesianValidation(data),
    // ...seriesBarData(data),
    // ...chartCartesianValidation(data),
    // labelsEnabled: data.labelsEnabled ?? true,
    // labels: data.labels || {},
  };
}

export type ChartBarSelection = Selection<SVGSVGElement | SVGGElement, BarChartValidation>;

export function chartBarRender(selection: ChartBarSelection): void {
  selection
    .call((s) => chartBaseRender(s))
    .classed('chart-bar', true)
    .each((chartD, i, g) => {
      const chartS = <ChartBarSelection>select(g[i]);
      const drawAreaS = chartS.selectAll('.draw-area');

      const barSeriesS = drawAreaS
        .selectAll<SVGGElement, SeriesBar>('.series-bar')
        .data([chartD])
        .join('g')
        .call((s) => seriesBarRender(s))
        .on('pointerover.chartbarhighlight', (e) => chartBarHoverBar(chartS, select(e.target), true))
        .on('pointerout.chartbarhighlight', (e) => chartBarHoverBar(chartS, select(e.target), false));

      drawAreaS
        .selectAll<Element, SeriesLabelBar>('.series-label-bar')
        .data(
          chartD.labelsEnabled
            ? [
                seriesLabelBarData({
                  barContainer: barSeriesS,
                  ...chartD.labels,
                }),
              ]
            : []
        )
        .join('g')
        .call((s) => seriesLabelBar(s));

      chartD.xAxis.scale = chartD.categoryScale;
      chartD.yAxis.scale = chartD.valueScale;
      chartCartesianAxisRender(chartS);
    });
}

export function chartBarHoverBar(chart: Selection, bar: Selection<Element, Bar>, hover: boolean) {
  bar.each((barD) => {
    chart.selectAll(`.label[data-key="${barD.key}"]`).classed('highlight', hover);
    chart.selectAll(`.axis-x .tick[data-key="${barD.category}"]`).classed('highlight', hover);
  });
}
