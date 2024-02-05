import {Chart} from "../chart";
import {rectFromString} from "../../../utilities/rect";
import {select, Selection} from "d3";
import {SVGHTMLElement} from "../../../constants/types";
import {ChartWindowValid} from "../../chart-window";
import {ChartCartesianValid} from "./chart-cartesian-validation";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";
import {elementFromSelection} from "../../../utilities/d3/util";
import {addZoom} from "../../../data/zoom";

export abstract class CartesianChart extends Chart {

  abstract windowSelection: Selection<HTMLDivElement, ChartCartesianValid & ChartWindowValid>
  protected addBuiltInListeners() {
    this.addFilterListener()
    this.addZoomListeners()
  }

  public override render() {
    this.preRender()
  }

  protected preRender() {
    if (!this.initialRenderHappened) return
    const drawArea = this.windowSelection.selectAll('.draw-area')
    const {x, y, ...restArgs} = this.windowSelection.datum()
    const {width, height} = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    const chartElement = elementFromSelection(this.chartSelection)
    const flipped = getCurrentRespVal(restArgs.series.flipped, {chart: chartElement})
    x.scaledValues.scale.range(flipped ? [height, 0] : [0, width])
    y.scaledValues.scale.range(flipped ? [0, width] : [height, 0])
  }

  private addFilterListener() {
    this.addCustomListener('change', (e) => {
      if (!e.target) return
      const changeS = select(e.target as SVGHTMLElement)
      if (changeS.attr('type') !== 'checkbox') return
      const parentS = changeS.select(function() {return this.parentElement})
      const currentKey = parentS.attr('data-key')
      if (!currentKey) return

      const {keysActive, x, y, categories} = this.windowSelection.datum().series
      if (keysActive[currentKey] !== undefined) {
        keysActive[currentKey] = changeS.property('checked')
      }
      categories?.setKeyActiveIfDefined(currentKey, changeS.property('checked'))
      x.setKeyActiveIfDefined(currentKey, changeS.property('checked'))
      y.setKeyActiveIfDefined(currentKey, changeS.property('checked'))
      this.render()
    })
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
      // The below code does not work
      // scatterPlotData.series.x = x
      // scatterPlotData.series.y = y

      renderer.windowSelection.data([{
        ...cartesianData, series: seriesUpdated
      }])

      renderer.windowSelection.dispatch('resize')
    })
  }
}
