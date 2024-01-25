import {select, Selection} from 'd3';
import {
  chartWindowRender,
  ChartWindowValid,
  layouterCompute,
  rectFromString,
  resizeEventListener,
  toolbarRender,
} from '../../core';
import {scatterPlotRender} from "./scatter-plot-render";
import {ScatterPlotArgs, ChartPointValid, scatterPlotValidation} from "./scatter-plot-validation";
import {addZoom} from "../../core/data/zoom";
import {getMaxRadius} from "../../core/data/radius/radius-util";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {SVGHTMLElement} from "../../core/constants/types";
import {CartesianChart} from "../../core/render/charts/chart-cartesian/cartesian-chart";

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
    const {
      chartS,
      layouterS
    } = chartWindowRender(this.windowSelection)
    toolbarRender(this.windowSelection)
    scatterPlotRender(chartS)
    layouterS.on('boundschange.chartwindowpoint', () => {
      scatterPlotRender(chartS)
      layouterS.call((s) => layouterCompute(s, false))
    }).call((s) => layouterCompute(s))
    resizeEventListener(this.windowSelection)
  }

  protected override addBuiltInListeners() {
    super.addBuiltInListeners()
    this.addZoomListeners()
    this.addFilterListener()
  }

  private addZoomListeners() {
    const renderer = this
    const chartWindowD = this.windowSelection.datum()
    const chartElement = elementFromSelection(this.windowSelection)
    if (!chartWindowD.zoom) return
    const drawArea = this.windowSelection.selectAll('.draw-area')
    renderer.addCustomListener('resize.zoom', () => {
      const { series, pointSeries} = renderer.windowSelection.datum()
      const { radii} = pointSeries
      const { x, y } = series
      const maxRadius = getMaxRadius(radii, {chart: chartElement})
      const drawAreaBounds = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
      //TODO: resizing is also necessary if no zoom
      x.scale.range(series.flipped ? [drawAreaBounds.height - maxRadius, maxRadius] : [maxRadius, drawAreaBounds.width - 2 * maxRadius])
      y.scale.range(series.flipped ? [maxRadius, drawAreaBounds.width - 2 * maxRadius] : [drawAreaBounds.height - maxRadius, maxRadius])
    })
    addZoom(this.windowSelection, ({xScale, yScale}) => {
      const {x, y, pointSeries} = renderer.windowSelection.datum()
      x.scaledValues = {...x.scaledValues, scale: xScale}
      y.scaledValues = {...y.scaledValues, scale: yScale}
      //TODO: solve the zoom-resize issue
      // with this code resizing works always, but zooming does not work
      // pointSeries.x = x.scaledValues
      // pointSeries.y = y.scaledValues

      //with this code zooming works, but resizing does only work on zoom
      renderer.windowSelection.data([{
        ...chartWindowD,
        pointSeries: {...pointSeries, x: x.scaledValues, y: y.scaledValues}
      }])

      //3rd Option: Maybe try to revalidate data completely on zoom before rerender
      renderer.windowSelection.dispatch('resize')
    })
  }

  private addFilterListener() {
    this.addCustomListener('change', (e) => {
      if (!e.target) return
      const changeS = select(e.target as SVGHTMLElement)
      if (changeS.attr('type') !== 'checkbox') return
      const parentS = changeS.select(function() {return this.parentElement})
      const currentKey = parentS.attr('data-key')
      if (!currentKey) return;
      const {keysActive} = this.windowSelection.datum().series
      keysActive[currentKey] = changeS.property('checked')
      this.render()
    })
  }
}
