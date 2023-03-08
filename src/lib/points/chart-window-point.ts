import {select, Selection} from 'd3';
import {chartWindowRender, layouterCompute, rectFromString, toolDownloadSVGRender,} from '../core';
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

export class PointChartRenderer {
  didRender = false
  selection: ChartWindowPointSelection
  constructor(selection: ChartWindowPointSelection) {
    this.selection = selection
  }

  buildWindowPointChart() {
    this.renderWindow(this.selection)
    this.setListeners(this.selection)
  }

  renderWindow(selection: ChartWindowPointSelection): void {
    selection
      .classed('chart-window-point', true)
      .call((s) => chartWindowRender(s))
      .each((chartWindowD, i, g) => {
        const chartWindowS = select<HTMLDivElement, ChartWindowPoint>(g[i])
        const menuItemsS = chartWindowS.selectAll('.menu-tools > .items')
        const layouterS = chartWindowS.selectAll<HTMLDivElement, any>('.layouter');

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

  private setListeners(selection: ChartWindowPointSelection) {
    if (this.didRender) return
    const renderer = this
    const drawArea = selection.selectAll('.draw-area');

    selection
      .each((chartWindowD, i, g) => {
        const chartWindowS = select<HTMLDivElement, ChartWindowPoint>(g[i])
        const {xScale, yScale, zoom} = chartWindowD
        if (!zoom) return
        drawArea.call(
          zoom.behaviour.scaleExtent([zoom.out, zoom.in]).on('zoom', function (e, d) {
            const newData = {
              ...chartWindowD,
              xScale: e.transform.rescaleX(xScale),
              yScale: e.transform.rescaleY(yScale)
            }
            renderer.renderWindow(selection.datum(newData))
          })
        )

        chartWindowS.on('resize', () => {
          const { width, height } = rectFromString(drawArea.attr('bounds') ?? "");
          const extent: [[number, number], [number, number]] = [
            [0, 0],
            [width, height],
          ];
          zoom.behaviour.extent(extent).translateExtent(extent);
          renderer.renderWindow(selection.datum(chartWindowD))
        });
      })
    this.didRender = true
  }

  chartWindowPointAutoResize(selection: ChartWindowPointSelection): void {
    const instance = this
    selection.on('resize', () => {
      instance.renderWindow(selection)
    });
  }
}

