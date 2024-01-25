import {Chart} from "../chart";
import {rectFromString} from "../../../utilities/rect";
import {select, Selection} from "d3";
import {SVGHTMLElement} from "../../../constants/types";
import {ChartWindowValid} from "../../chart-window";
import {ChartCartesianValid} from "./chart-cartesian-validation";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";
import {elementFromSelection} from "../../../utilities/d3/util";

export abstract class CartesianChart extends Chart {

  abstract windowSelection: Selection<SVGHTMLElement, ChartCartesianValid & ChartWindowValid>
  protected addBuiltInListeners() {
    const renderer = this
    const drawArea = this.windowSelection.selectAll('.draw-area')
    this.addFilterListener()
    if(this.chartSelection?.classed('chart-point')) return
    //TODO: This is conflicting with zoom listener. But bar chart and others need it.
    // Find better way of rescaling everything!
    this.addCustomListener('resize.axisRescale', () => {
      const {x, y, ...restArgs} = renderer.windowSelection.datum()
      const {width, height} = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
      const chartElement = elementFromSelection(renderer.chartSelection)
      const flipped = getCurrentRespVal(restArgs.series.flipped, {chart: chartElement})
      x.scaledValues.scale.range(flipped ? [height, 0] : [0, width])
      y.scaledValues.scale.range(flipped ? [0, width] : [height, 0])
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
      console.log(currentKey, keysActive)
      keysActive[currentKey] = changeS.property('checked')
      this.render()
    })
  }
}
