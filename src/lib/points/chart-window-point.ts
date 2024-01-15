import {Selection} from 'd3';
import {chartWindowRender, ChartWindowValid, layouterCompute, rectFromString,} from '../core';
import {chartPointRender} from "./chart-point-render";
import {ChartPointArgs, chartPointData, ChartPointValid} from "./chart-point-validation";
import {addZoom} from "../core/data/zoom";
import {Chart} from "../core/render/charts/chart";
import {getMaxRadius} from "../core/data/radius/radius-util";
import {elementFromSelection} from "../core/utilities/d3/util";

export type ScatterplotData = ChartWindowValid & ChartPointValid
export type ScatterplotSelection = Selection<HTMLDivElement, ScatterplotData>;

type ChartPointUserArgs = Omit<ChartPointArgs, 'renderer'>

export class ScatterPlot extends Chart { //implements IWindowChartBaseRenderer
  public windowSelection: ScatterplotSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: ChartPointUserArgs) {
    super({...data, type: 'point'})
    const chartData = chartPointData({...data, renderer: this})
    this.windowSelection = windowSelection as ScatterplotSelection
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  public render(): void {
    const {
      chartS,
      layouterS
    } = chartWindowRender(this.windowSelection)
    chartPointRender(chartS)
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
      const {flipped, x, y, pointSeries} = renderer.windowSelection.datum()
      const {radii} = pointSeries
      const maxRadius = getMaxRadius(radii, {chart: chartElement})
      const drawAreaBounds = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
      x.scale.range(flipped ? [drawAreaBounds.height - maxRadius, maxRadius] : [maxRadius, drawAreaBounds.width - 2 * maxRadius])
      y.scale.range(flipped ? [maxRadius, drawAreaBounds.width - 2 * maxRadius] : [drawAreaBounds.height - maxRadius, maxRadius])
    })
    addZoom(this.windowSelection, ({xScale, yScale}) => {
      const {x, y, pointSeries} = renderer.windowSelection.datum()
      const xRescaled = {...x, scale: xScale}
      const yRescaled = {...y, scale: yScale}
      renderer.windowSelection.data([{
          ...chartWindowD,
          x: xRescaled, y: yRescaled, pointSeries: {...pointSeries, x: xRescaled, y: yRescaled}
      }])
      renderer.windowSelection.dispatch('resize')
    })
  }
}
