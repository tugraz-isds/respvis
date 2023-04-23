import {select, Selection} from 'd3';
import {layouterCompute, toolDownloadSVGRender, windowChartBaseRender,} from '../core';
import {chartPointRender} from './chart-point';
import {ChartPointArgs, ChartPointData, chartPointData} from "./chart-point-data";
import {IWindowChartBaseRenderer} from "../core/charts/chart-base/IWindowChartBaseRenderer";

export interface ChartWindowPoint extends ChartPointArgs {}

export function chartWindowPointData(data: ChartPointArgs): ChartPointData {
  const chartData = chartPointData(data);
  return {
    ...chartData,
  };
}

export type ChartWindowPointSelection = Selection<HTMLDivElement, ChartPointData>;

export class ScatterPlot implements IWindowChartBaseRenderer {
  addedListeners = false
  data: ChartPointData
  constructor(public selection: ChartWindowPointSelection, data: ChartPointArgs) {
    this.data = chartWindowPointData(data)
  }

  /**
   * Adds custom event listener. Be sure to add custom event listeners before calling {@link buildWindowChart}
   * as the method also adds listeners and the order matters.
   */
  addCustomListener(name: string, callback: (selection: ChartWindowPointSelection, data: ChartPointData) => void) {
    this.selection.on(name, callback)
  }

  buildWindowChart() {
    this.renderWindow()
    this.addBuiltInListeners()
    this.addedListeners = true
  }

  private renderWindow(): void {
    this.selection
      .datum(this.data)
      .classed('chart-window-point', true)
      .call((s) => windowChartBaseRender(s))
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

  private addBuiltInListeners() {
    if (this.addedListeners) return
    this.addZoomListeners()
    this.addFinalListeners()
  }

  private addZoomListeners() {
    const renderer = this
    const drawArea = this.selection.selectAll('.draw-area');

    this.selection
      .each((chartWindowD, i, g) => {
        const chartWindowS = select<HTMLDivElement, ChartWindowPoint>(g[i])
        const {xScale, yScale, zoom} = chartWindowD
        if (!zoom) return
        drawArea.call(
          zoom.behaviour.scaleExtent([zoom.out, zoom.in]).on('zoom.autozoom', function (e, d) {
            renderer.data = {
              ...chartWindowD,
              xScale: e.transform.rescaleX(xScale),
              yScale: e.transform.rescaleY(yScale)
            }
            chartWindowS.dispatch('resize')
          })
        )

        chartWindowS.on('resize.autozoom', () => {
          const [x, widthTranslate] = xScale.range()
          const [y, heightTranslate] = yScale.range()
          const extent: [[number, number], [number, number]] = [
            [x, heightTranslate],
            [widthTranslate, y],
          ];
          zoom.behaviour.extent(extent).translateExtent(extent);
        });
      })
  }

  private addFinalListeners() {
    const instance = this
    this.selection.on('resize.final', () => {instance.renderWindow()});
    this.data.zoom?.behaviour.on('zoom.final', () => { instance.renderWindow()})
  }
}

