import {CategoriesUserArgs} from "../../data/categories";
import {RenderArgs, Renderer} from "../chart/renderer";
import {ActiveKeyMap, SeriesKey} from "../../constants/types";
import {Size} from "../../utilities/size";
import {ScaledValuesCategorical} from "../../data/scale/scaled-values-categorical";
import {mergeKeys} from "../../utilities/dom/key";
//TODO: Refactor away type dependency to respvis-point
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {elementFromSelection, rectFromString} from "../../utilities";
import {getCurrentRespVal} from "../../data";
import {Selection} from "d3";
import {Point} from "../../../../respvis-point/ts";
import {SeriesTooltipGenerator} from "respvis-tooltip";

export type SeriesUserArgs = {
  categories?: CategoriesUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
  labelCallback?: (category: string) => string
  flipped?: RespValByValueOptional<boolean>
}

export type SeriesArgs = SeriesUserArgs & RenderArgs & {
  originalSeries?: Series
  key: SeriesKey
  bounds?: Size
}

export abstract class Series implements RenderArgs {
  class = true
  originalSeries: Series
  categories?: ScaledValuesCategorical
  key: SeriesKey
  keysActive: ActiveKeyMap
  bounds: Size
  labelCallback: (category: string) => string
  renderer: Renderer
  providesTool = false
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, any>
  abstract responsiveState: ResponsiveState

  constructor(args: SeriesArgs | Series) {
    const {key, labelCallback} = args

    this.originalSeries = args.originalSeries ?? this

    //TODO: pass correct parameters here
    if ('class' in args) this.categories = args.categories
    else this.categories = args.categories ? new ScaledValuesCategorical({
      ...args.categories, parentKey: key,
    }) : undefined

    this.bounds = args.bounds || {width: 600, height: 400}
    this.key = args.key
    this.markerTooltipGenerator = args.markerTooltipGenerator

    if ('class' in args) this.keysActive = {...args.keysActive}
    else {
      this.keysActive = {}
      this.keysActive[key] = true
    }
    this.labelCallback = 'class' in args ? args.labelCallback : (labelCallback ?? ((label: string) => label))
    this.renderer = args.renderer
  }

  abstract getCombinedKey(i: number): string

  getMergedKeys() {
    if (this.categories) {
      return this.categories.categories.keyOrder.map(cKey =>
        mergeKeys([this.key, cKey]))
    }
    return [this.key]
  }

  getCategories() {
    return this.categories
  }

  toolRender(toolbarS: Selection<HTMLDivElement>) {}

  abstract getScaledValuesAtScreenPosition(x: number, y: number) : { x: string, y: string }

  abstract clone(): Series
}



export type ResponsiveStateArgs = {
  series: Series
  originalSeries: Series
  flipped?: RespValByValueOptional<boolean>
  currentlyFlipped?: boolean
  drawAreaWidth?: number
  drawAreaHeight?: number
}

export abstract class ResponsiveState {
  protected _series: Series
  protected _originalSeries: Series
  protected _flipped: RespValByValueOptional<boolean>
  protected _currentlyFlipped: boolean
  protected _drawAreaWidth: number
  protected _drawAreaHeight: number

  constructor(args: ResponsiveStateArgs) {
    this._series = args.series
    this._originalSeries = args.originalSeries
    this._flipped = args.flipped ?? false
    this._currentlyFlipped = args.currentlyFlipped ?? false
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
    const chartElement = elementFromSelection(this._series.renderer.chartS)
    this._currentlyFlipped = getCurrentRespVal(this._flipped, {chart: chartElement})
  }

  cloneProps(): ResponsiveStateArgs {
    return {
      series: this._series, originalSeries: this._originalSeries,
      flipped: this.flipped, currentlyFlipped: this.currentlyFlipped,
      drawAreaWidth: this.drawAreaWidth, drawAreaHeight: this.drawAreaHeight,
    }
  }
}
