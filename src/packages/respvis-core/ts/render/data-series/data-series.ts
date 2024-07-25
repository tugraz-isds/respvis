import {RenderArgs, Renderer} from "../chart/renderer";
import {
  ResponsiveValueOptional,
  ResponsiveValueUserArgs,
  validateResponsiveValue
} from "../../data/responsive-property/responsive-value";
import {getCurrentResponsiveValue, rectFromString} from "../../data";
import {Selection} from "d3";
import {LegendSelection} from "../legend";
import {DataSeriesData} from "./data-series-validation";

export abstract class DataSeries implements RenderArgs {
  abstract originalData: DataSeriesData
  abstract renderData: DataSeriesData
  abstract renderer: Renderer
  abstract responsiveState: ResponsiveState
  providesTool = false
  class = true

  renderTool(toolbarS: Selection<HTMLDivElement>) {}

  renderLegendInfo(legendS: LegendSelection) {}

  abstract getScaledValuesAtScreenPosition(horizontal: number, vertical: number): {
    horizontal: string,
    horizontalName: string
    vertical: string,
    verticalName: string
  }

  // TODO: uncomment once all methods exist for all existing data series classes
  abstract cloneToRenderData(): DataSeries

  abstract applyFilter(): DataSeries

  abstract applyZoom(): DataSeries

  abstract applyInversion(): DataSeries
}


export type ResponsiveStateArgs = {
  series: DataSeries
  flipped?: ResponsiveValueUserArgs<boolean>
  currentlyFlipped?: boolean
  previouslyFlipped?: boolean
  drawAreaWidth?: number
  drawAreaHeight?: number
}

export class ResponsiveState {
  protected _series: DataSeries
  protected _flipped: ResponsiveValueOptional<boolean>
  protected _currentlyFlipped: boolean
  protected _previouslyFlipped: boolean
  protected _drawAreaWidth: number
  protected _drawAreaHeight: number

  constructor(args: ResponsiveStateArgs) {
    this._series = args.series
    this._flipped = args.flipped ? validateResponsiveValue(args.flipped) : false
    this._currentlyFlipped = args.currentlyFlipped ?? false
    this._previouslyFlipped = this._currentlyFlipped
    this._drawAreaWidth = args.drawAreaWidth ?? 0
    this._drawAreaHeight = args.drawAreaHeight ?? 0
  }

  get flipped() {
    return this._flipped
  }

  get currentlyFlipped() {
    return this._currentlyFlipped
  }

  get drawAreaWidth() {
    return this._drawAreaWidth
  }

  get drawAreaHeight() {
    return this._drawAreaHeight
  }

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

    this._previouslyFlipped = this._currentlyFlipped
    this._currentlyFlipped = getCurrentResponsiveValue(this._flipped, {chart: this._series.renderer.chartS})
  }

  cloneProps(): ResponsiveStateArgs {
    return {
      series: this._series,
      flipped: this.flipped, currentlyFlipped: this.currentlyFlipped, previouslyFlipped: this._previouslyFlipped,
      drawAreaWidth: this.drawAreaWidth, drawAreaHeight: this.drawAreaHeight,
    }
  }
}
