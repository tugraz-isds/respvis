import {select, Selection} from 'd3';
import {IWindowChartBaseRenderer, layouterCompute,} from '../core';
import {chartPointRender} from './chart-point';
import {ChartPointArgs, ChartPointData, chartPointData} from "./chart-point-data";
import {ChartWindowValid, validateChartWindow} from "../core";
import {renderChartWindow} from "../core";

export type ScatterplotData = ChartWindowValid & ChartPointData
export type ScatterplotSelection = Selection<HTMLDivElement, ScatterplotData>;

export class ScatterPlot implements IWindowChartBaseRenderer {
  addedListeners = false
  data: ChartWindowValid & ChartPointData

  constructor(public selection: ScatterplotSelection, data: ChartPointArgs) {
    const chartData = chartPointData(data)
    const windowData = validateChartWindow({...chartData, type: 'point'})
    this.data = {...chartData, ...windowData}
  }

  /**
   * Adds custom event listener. Be sure to add custom event listeners before calling {@link ScatterPlot.buildWindowChart}
   * as the method also adds listeners and the order matters.
   */
  addCustomListener(name: string, callback: (event: Event, data: ChartPointData) => void) {
    this.selection.on(name, callback)
  }

  buildWindowChart() {
    this.renderWindow()
    this.addBuiltInListeners()
    this.addedListeners = true
  }

  private renderWindow(): void {
    const {
      chartS,
      layouterS
    } = renderChartWindow(this.selection, this.data)
    chartS.call((s) => chartPointRender(s))
    layouterS.on('boundschange.chartwindowpoint', () => chartPointRender(chartS))
      .call((s) => layouterCompute(s));
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
        const chartWindowS = select<HTMLDivElement, ScatterplotData>(g[i])
        const {x, y, zoom, pointSeries} = chartWindowD
        if (!zoom) return
        drawArea.call(
          zoom.behaviour.scaleExtent([zoom.out, zoom.in]).on('zoom.autozoom', function (e) {
            const xUpdated = {...x, scale: e.transform.rescaleX(x.scale)}
            const yUpdated = {...y, scale: e.transform.rescaleY(y.scale)}
            renderer.data = {
              ...chartWindowD,
              x: xUpdated,
              y: yUpdated,
              pointSeries: {...pointSeries, x: xUpdated, y: yUpdated}
            }
            chartWindowS.dispatch('resize')
          })
        )

        chartWindowS.on('resize.autozoom', () => {
          const [x1, widthTranslate] = x.scale.range()
          const [y1, heightTranslate] = y.scale.range()
          const extent: [[number, number], [number, number]] = [
            [x1, heightTranslate],
            [widthTranslate, y1],
          ];
          zoom.behaviour.extent(extent).translateExtent(extent);
        });
      })
  }

  private addFinalListeners() {
    const instance = this
    this.selection.on('resize.final', () => {
      instance.renderWindow()
    });
    this.data.zoom?.behaviour.on('zoom.final', () => {
      instance.renderWindow()
    })
  }
}

