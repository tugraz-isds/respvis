import {Selection} from 'd3';
import {ChartWindowValid, layouterCompute, renderChartWindow, validateChartWindow,} from '../core';
import {chartPointRender} from './chart-point';
import {ChartPointArgs, ChartPointData, chartPointData} from "./chart-point-data";
import {addZoom} from "../core/utilities/zoom";
import {Chart} from "../core/charts/chart";

export type ScatterplotData = ChartWindowValid & ChartPointData
export type ScatterplotSelection = Selection<HTMLDivElement, ScatterplotData>;

export class ScatterPlot extends Chart { //implements IWindowChartBaseRenderer
  data: ScatterplotData

  constructor(public selection: ScatterplotSelection, data: ChartPointArgs) {
    super(selection)
    const chartData = chartPointData(data)
    const windowData = validateChartWindow({...chartData, type: 'point'})
    this.data = {...chartData, ...windowData}
  }

  public render(): void {
    const {
      chartS,
      layouterS
    } = renderChartWindow(this.selection, this.data)
    chartS.call((s) => chartPointRender(s))
    layouterS.on('boundschange.chartwindowpoint', () => {
      chartPointRender(chartS)
      layouterS.call((s) => layouterCompute(s, false))
    }).call((s) => layouterCompute(s));
  }

  protected addBuiltInListeners() {
    this.addZoomListeners()
  }

  private addZoomListeners() {
    const renderer = this
    const chartWindowD = this.selection.datum()
    if (!chartWindowD.zoom) return
    addZoom(this.selection, ({xScale, yScale}) => {
      const {x, y, pointSeries} = renderer.data
      const xRescaled = {...x, scale: xScale}
      const yRescaled = {...y, scale: yScale}
      renderer.data = {
        ...chartWindowD,
        x: xRescaled, y: yRescaled, pointSeries: {...pointSeries, x: xRescaled, y: yRescaled}
      }
      renderer.selection.dispatch('resize')
    })
  }
}
