import {select, Selection} from 'd3';
import {chartWindowRender, layouterCompute, toolDownloadSVGRender,} from '../core';
import {chartPointRender} from './chart-point';
import {ChartPointArgs, ChartPointData, chartPointData} from "./chart-point-data";

export interface ChartWindowPoint extends ChartPointArgs {}

export function chartWindowPointData(data: ChartPointArgs): ChartPointData {
  const chartData = chartPointData(data);
  return {
    ...chartData,
  };
}

export type ChartWindowPointSelection = Selection<HTMLDivElement, ChartPointData>;

export function chartWindowPointRender(selection: ChartWindowPointSelection): void {
  selection
    .classed('chart-window-point', true)
    .call((s) => chartWindowRender(s))
    .each((chartWindowD, i, g) => {
      const chartWindowS = select<HTMLDivElement, ChartWindowPoint>(g[i]),
        menuItemsS = chartWindowS.selectAll('.menu-tools > .items'),
        layouterS = chartWindowS.selectAll<HTMLDivElement, any>('.layouter');

      // download svg
      menuItemsS
        .selectAll<HTMLLIElement, any>('.tool-download-svg')
        .data([null])
        .join('li')
        .call((s) => toolDownloadSVGRender(s));

      // chart
      const chartS = layouterS
        .selectAll<SVGSVGElement, ChartPointData>('svg.chart-point')
        .data([chartWindowD])
        .join('svg')
        .call((s) => chartPointRender(s));

      layouterS
        .on('boundschange.chartwindowpoint', () => chartPointRender(chartS))
        .call((s) => layouterCompute(s));
    });
}

export function chartWindowPointAutoResize(selection: ChartWindowPointSelection): void {
  selection.on('resize', function () {
    select<HTMLDivElement, ChartPointData>(this).call((s) => chartWindowPointRender(s));
  });
}
