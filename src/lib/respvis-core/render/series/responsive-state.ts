import {rectFromString} from "../../utilities/graphic-elements/rect";
import {elementFromSelection} from "../../utilities/d3/util";
import {getCurrentRespVal} from "../../data/responsive-value/responsive-value";
import {Series} from "./index";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";

export type SeriesResponsiveStateArgs = {
  series: Series
  originalSeries: Series
  flipped?: RespValByValueOptional<boolean>
  currentlyFlipped?: boolean
  drawAreaWidth?: number
  drawAreaHeight?: number
}

export class SeriesResponsiveState {
  protected _series: Series
  protected _originalSeries: Series
  protected _flipped: RespValByValueOptional<boolean>
  protected _currentlyFlipped: boolean
  protected _drawAreaWidth: number
  protected _drawAreaHeight: number

  constructor(args: SeriesResponsiveStateArgs) {
    this._series = args.series
    this._originalSeries = args.originalSeries
    this._flipped = args.flipped ?? false
    this._currentlyFlipped = args.currentlyFlipped ?? false
    this._drawAreaWidth = args.drawAreaWidth ?? 0
    this._drawAreaHeight = args.drawAreaHeight ?? 0
  }

  get flipped() { return this._flipped }
  get currentlyFlipped() { return this._currentlyFlipped }
  get drawAreaWidth() { return this._drawAreaWidth }
  get drawAreaHeight() { return this._drawAreaHeight }

  drawAreaS() {
    return this._series.renderer.windowS.selectAll<SVGSVGElement, any>('.draw-area')
  }

  drawAreaRange() {
    return {
      horizontal: [0, this._drawAreaWidth],
      horizontalInverted: [this._drawAreaWidth, 0],
      vertical: [this._drawAreaHeight, 0],
      verticalInverted: [0, this._drawAreaHeight]
    }
  }

  update() {
    const drawArea = this.drawAreaS()
    const {width, height} = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    this._drawAreaWidth = width
    this._drawAreaHeight = height
    const chartElement = elementFromSelection(this._series.renderer.chartS)
    this._currentlyFlipped = getCurrentRespVal(this._flipped, {chart: chartElement})
  }

  cloneProps(): SeriesResponsiveStateArgs {
    return {
      series: this._series, originalSeries: this._originalSeries,
      flipped: this.flipped, currentlyFlipped: this.currentlyFlipped,
      drawAreaWidth: this.drawAreaWidth, drawAreaHeight: this.drawAreaHeight,
    }
  }

}
