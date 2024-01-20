import {Chart} from "../chart";
import {rectFromString} from "../../../utilities/rect";
import {Selection} from "d3";
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
    this.addCustomListener('resize.axisRescale', () => {
      const {x, y, ...restArgs} = renderer.windowSelection.datum()
      const {width, height} = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
      const chartElement = elementFromSelection(renderer.chartSelection)
      const flipped = getCurrentRespVal(restArgs.flipped, {chart: chartElement})
      x.scale.range(flipped ? [height, 0] : [0, width])
      y.scale.range(flipped ? [0, width] : [height, 0])
    })
  }
}
