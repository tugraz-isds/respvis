import {Selection} from 'd3';
import {
  AxisScaledValuesValid,
  chartWindowRender,
  ChartWindowValid,
  layouterCompute,
  rectFromString,
  toolbarRender,
} from '../../core';
import {scatterPlotRender} from "./scatter-plot-render";
import {ChartPointValid, ScatterPlotArgs, scatterPlotValidation} from "./scatter-plot-validation";
import {addZoom} from "../../core/data/zoom";
import {getMaxRadius} from "../../core/data/radius/radius-util";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {CartesianChart} from "../../core/render/charts/chart-cartesian/cartesian-chart";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";
import {isScaledValuesCategorical} from "../../core/data/scale/scaled-values";

export type ScatterplotData = ChartWindowValid & ChartPointValid
export type ScatterplotSelection = Selection<HTMLDivElement, ScatterplotData>;

export type ChartPointUserArgs = Omit<ScatterPlotArgs, 'renderer'>

export class ScatterPlot extends CartesianChart { //implements IWindowChartBaseRenderer
  public windowSelection: ScatterplotSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: ChartPointUserArgs) {
    super({...data, type: 'point'})
    const chartData = scatterPlotValidation({...data, renderer: this})
    this.windowSelection = windowSelection as ScatterplotSelection
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  public render(): void {
    super.render()
    const {
      chartS,
      layouterS
    } = chartWindowRender(this.windowSelection)
    toolbarRender(this.windowSelection)
    scatterPlotRender(chartS)
    const boundsChanged = layouterCompute(layouterS)
    if (boundsChanged) this.render()
  }

  protected override addBuiltInListeners() {
    super.addBuiltInListeners()
    this.addZoomListeners()
  }

  protected override preRender() {
    if (!this.initialRenderHappened) return
    const { series} = this.windowSelection.datum()
    const { radii} = series
    const { x, y } = series
    const drawArea = this.windowSelection.selectAll('.draw-area')
    const chartElement = elementFromSelection(this.chartSelection)
    const maxRadius = getMaxRadius(radii, {chart: chartElement})
    const drawAreaBounds = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    const flipped = getCurrentRespVal(series.flipped, {chart: chartElement})
    //TODO: resizing is also necessary if no zoom
    x.scale.range(flipped ? [drawAreaBounds.height - maxRadius, maxRadius] : [maxRadius, drawAreaBounds.width - 2 * maxRadius])
    y.scale.range(flipped ? [maxRadius, drawAreaBounds.width - 2 * maxRadius] : [drawAreaBounds.height - maxRadius, maxRadius])
  }

  private addZoomListeners() {
    const renderer = this
    const chartWindowD = this.windowSelection.datum()
    if (!chartWindowD.zoom) return

    addZoom(this.windowSelection, ({xScale, yScale}) => {
      const {x, y, series} = renderer.windowSelection.datum()
      if (isScaledValuesCategorical(x.scaledValues) || isScaledValuesCategorical(y.scaledValues)) return

      x.scaledValues = {...x.scaledValues, scale: xScale} as AxisScaledValuesValid
      y.scaledValues = {...y.scaledValues, scale: yScale} as AxisScaledValuesValid

      renderer.windowSelection.data([{
        ...chartWindowD,
        series: {...series, x: x.scaledValues, y: y.scaledValues}
      }])

      renderer.windowSelection.dispatch('resize')
    })
  }
}
