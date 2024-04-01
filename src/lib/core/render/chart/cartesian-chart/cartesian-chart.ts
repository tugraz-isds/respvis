import {Selection} from "d3";
import {WindowValid} from "../../window";
import {CartesianChartValid} from "./cartesian-chart-validation";
import {addZoom} from "../../../data/zoom";
import {SeriesChart} from "../series-chart/series-chart";
import {cartesianChartAxisRender} from "./cartesian-chart-render";

type ChartSelection = Selection<SVGSVGElement, CartesianChartValid & WindowValid>

export abstract class CartesianChart extends SeriesChart {
  abstract windowS: Selection<HTMLDivElement, CartesianChartValid & WindowValid>
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }


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
    const chartWindowD = this.windowS.datum()
    if (!chartWindowD.zoom) return

    addZoom(this.windowS, ({x, y}) => {
      const cartesianData = renderer.windowS.datum()
      const seriesUpdated = cartesianData.series.clone()
      seriesUpdated.x = x
      seriesUpdated.y = y
      cartesianData.x.scaledValues = x
      cartesianData.y.scaledValues = y

      renderer.windowS.data([{
        ...cartesianData, series: seriesUpdated
      }])

      renderer.windowS.dispatch('resize')
    })
  }

  protected renderAxes() {
    this.chartS!.call(cartesianChartAxisRender)
  }
}
