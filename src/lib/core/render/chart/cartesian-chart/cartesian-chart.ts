import {Selection} from "d3";
import {WindowValid} from "../../window";
import {CartesianChartValid} from "./cartesian-chart-validation";
import {addZoom} from "../../../data/zoom";
import {SeriesChart} from "../series-chart/series-chart";
import {cartesianChartAxisRender} from "./cartesian-chart-render";

export abstract class CartesianChart extends SeriesChart {

  abstract windowSelection: Selection<HTMLDivElement, CartesianChartValid & WindowValid>
  abstract chartSelection?: Selection<SVGSVGElement, CartesianChartValid & WindowValid>

  protected addBuiltInListeners() {
    super.addBuiltInListeners()
    this.addZoomListeners()
  }

  protected preRender() {
    if (!this.initialRenderHappened) return
    // const drawArea = this.windowSelection.selectAll('.draw-area')
    // const {x, y, ...restArgs} = this.windowSelection.datum()
    // const {width, height} = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    // const chartElement = elementFromSelection(this.chartSelection)
    // const flipped = getCurrentRespVal(restArgs.series.responsiveState.currentlyFlipped, {chart: chartElement})
    // x.scaledValues.scale.range(flipped ? [height, 0] : [0, width])
    // y.scaledValues.scale.range(flipped ? [0, width] : [height, 0])
  }

  private addZoomListeners() {
    const renderer = this
    const chartWindowD = this.windowSelection.datum()
    if (!chartWindowD.zoom) return

    addZoom(this.windowSelection, ({x, y}) => {
      const cartesianData = renderer.windowSelection.datum()
      const seriesUpdated = cartesianData.series.clone()
      seriesUpdated.x = x
      seriesUpdated.y = y
      cartesianData.x.scaledValues = x
      cartesianData.y.scaledValues = y

      renderer.windowSelection.data([{
        ...cartesianData, series: seriesUpdated
      }])

      renderer.windowSelection.dispatch('resize')
    })
  }

  protected renderAxes() {
    this.chartSelection!.call(cartesianChartAxisRender)
  }
}
