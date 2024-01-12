import {Selection} from 'd3';
import {ChartWindowValid, layouterCompute, rectFromString, renderChartWindow, validateChartWindow,} from '../core';
import {chartPointRender} from './chart-point';
import {ChartPointArgs, ChartPointData, chartPointData} from "./chart-point-data";
import {addZoom} from "../core/data/zoom";
import {Chart} from "../core/render/charts/chart";
import {getMaxRadius} from "../core/data/radius/radius-dimension";
import {elementFromSelection} from "../core/utilities/d3/util";

export type ScatterplotData = ChartWindowValid & ChartPointData
export type ScatterplotSelection = Selection<HTMLDivElement, ScatterplotData>;

type ChartPointUserArgs = Omit<ChartPointArgs, 'renderer'>

export class ScatterPlot extends Chart { //implements IWindowChartBaseRenderer
  data: ScatterplotData

  constructor(public windowSelection: ScatterplotSelection, data: ChartPointUserArgs) {
    super(windowSelection)
    const chartData = chartPointData({...data, renderer: this})
    const windowData = validateChartWindow({...chartData, type: 'point'})
    this.data = {...chartData, ...windowData}
  }

  public render(): void {
    const {
      chartS,
      layouterS
    } = renderChartWindow(this.windowSelection, this.data)
    chartS.call((s) => chartPointRender(s))
    layouterS.on('boundschange.chartwindowpoint', () => {
      chartPointRender(chartS)
      layouterS.call((s) => layouterCompute(s, false))
    }).call((s) => layouterCompute(s))
  }

  protected addBuiltInListeners() {
    this.addZoomListeners()
  }

  private addZoomListeners() {
    const renderer = this
    const chartWindowD = this.windowSelection.datum()
    const chartElement = elementFromSelection(this.windowSelection)
    if (!chartWindowD.zoom) return
    const drawArea = this.windowSelection.selectAll('.draw-area')
    renderer.addCustomListener('resize.zoom', () => {
      const {flipped, x, y, pointSeries} = renderer.data
      const {radii} = pointSeries
      const maxRadius = getMaxRadius(radii, {chart: chartElement})
      const drawAreaBounds = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
      x.scale.range(flipped ? [drawAreaBounds.height - maxRadius, maxRadius] : [maxRadius, drawAreaBounds.width - 2 * maxRadius])
      y.scale.range(flipped ? [maxRadius, drawAreaBounds.width - 2 * maxRadius] : [drawAreaBounds.height - maxRadius, maxRadius])
    })
    addZoom(this.windowSelection, ({xScale, yScale}) => {
      const {x, y, pointSeries} = renderer.data
      const xRescaled = {...x, scale: xScale}
      const yRescaled = {...y, scale: yScale}
      renderer.data = {
        ...chartWindowD,
        x: xRescaled, y: yRescaled, pointSeries: {...pointSeries, x: xRescaled, y: yRescaled}
      }
      renderer.windowSelection.dispatch('resize')
    })
  }
}
