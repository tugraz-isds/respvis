import {rectFromString} from "../../utilities/rect";
import {elementFromSelection} from "../../utilities/d3/util";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";
import {Series} from "./index";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";

export type SeriesResponsiveStateArgs = {
  flipped?: RespValByValueOptional<boolean>
  currentlyFlipped?: boolean
  series: Series
}
export class SeriesResponsiveState {
  series: Series
  flipped: RespValByValueOptional<boolean>
  currentlyFlipped: boolean
  drawAreaWidth = 0
  drawAreaHeight = 0

  constructor(args: SeriesResponsiveStateArgs) {
    this.series = args.series
    this.flipped = args.flipped ?? false
    this.currentlyFlipped = args.currentlyFlipped ?? false
  }

  drawAreaS() {
    return this.series.renderer.windowSelection.selectAll<SVGSVGElement, any>('.draw-area')
  }

  drawAreaRange() {
    return {
      horizontal: [0, this.drawAreaWidth],
      horizontalInverted: [this.drawAreaWidth, 0],
      vertical: [this.drawAreaHeight, 0],
      verticalInverted: [0, this.drawAreaHeight]
    }
  }

  update() {
    const drawArea = this.drawAreaS()
    const {width, height} = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    this.drawAreaWidth = width
    this.drawAreaHeight = height
    const chartElement = elementFromSelection(this.series.renderer.chartSelection)
    this.currentlyFlipped = getCurrentRespVal(this.flipped, {chart: chartElement})
  }
}
