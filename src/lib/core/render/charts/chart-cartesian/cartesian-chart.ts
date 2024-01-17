import {Chart} from "../chart";
import {rectFromString} from "../../../utilities/rect";
import {Selection} from "d3";
import {SVGHTMLElement} from "../../../constants/types";
import {ChartWindowValid} from "../../chart-window";
import {ChartCartesianValid} from "./chart-cartesian-validation";

export abstract class CartesianChart extends Chart {

  abstract windowSelection: Selection<SVGHTMLElement, ChartCartesianValid & ChartWindowValid>
  protected addBuiltInListeners() {
    const renderer = this
    const drawArea = this.windowSelection.selectAll('.draw-area')
    this.addCustomListener('resize.axisRescale', () => {
      const {x, y, flipped} = renderer.windowSelection.datum()
      const drawAreaBounds = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
      x.scale.range(flipped ? [drawAreaBounds.height] : [0, drawAreaBounds.width])
      y.scale.range(flipped ? [0, drawAreaBounds.width] : [drawAreaBounds.height, 0])
    })
  }
}
