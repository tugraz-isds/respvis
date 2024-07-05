import {CategoriesUserArgs} from "../../data/categories";
import {RenderArgs, Renderer} from "../chart/renderer";
import {ActiveKeyMap, SeriesKey} from "../../constants/types";
import {Size} from "../../utilities/geometry/shapes/rect/size";
import {ScaledValuesCategorical} from "../../data/scale/scaled-values-spatial/scaled-values-categorical";
import {mergeKeys} from "../../utilities/key";
//TODO: Refactor away type dependency to respvis-point
import {
  ResponsiveValueOptional,
  ResponsiveValueUserArgs,
  validateResponsiveValue
} from "../../data/responsive-property/responsive-value";
import {
  getCurrentResponsiveValue,
  rectFromString,
  SequentialColor,
  SequentialColorUserArgs,
  validateSequentialColor
} from "../../data";
import {Selection} from "d3";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import {LegendSelection} from "../legend";

export type SeriesUserArgs = {
  categories?: CategoriesUserArgs
  //TODO: Refactor ColorContinuous
  color?: SequentialColorUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGElement, any>
  flipped?: ResponsiveValueUserArgs<boolean>
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
  color?: SequentialColor
  key: SeriesKey
  keysActive: ActiveKeyMap
  renderer: Renderer
  providesTool = false
  responsiveState: ResponsiveState
  abstract markerTooltipGenerator?: SeriesTooltipGenerator<SVGElement, any>

  constructor(args: SeriesArgs | Series) {
    const {key} = args
    this.renderer = args.renderer
    this.originalSeries = args.originalSeries ?? this

    //TODO: pass correct parameters here
    if ('class' in args) this.categories = args.categories
    else this.categories = args.categories ? new ScaledValuesCategorical({
      ...args.categories, parentKey: key,
    }) : undefined

    if ('class' in args) this.color = args.color
    else this.color = args.color ? validateSequentialColor({...args.color, renderer: this.renderer, series: this}) : undefined

    this.key = args.key

    if ('class' in args) this.keysActive = {...args.keysActive}
    else {
      this.keysActive = {}
      this.keysActive[key] = true
    }

    this.responsiveState = 'class' in args ? args.responsiveState : new ResponsiveState({
      series: this,
      originalSeries: this.originalSeries,
      flipped: ('flipped' in args) ? args.flipped : false
    })
  }

  abstract getCombinedKey(i: number): string

  getMergedKeys() {
    if (this.categories) {
      return this.categories.categories.categoryArray.map(c =>
        mergeKeys([this.key, c.key]))
    }
    return [this.key]
  }

  getCategories() {
    return this.categories
  }

  renderTool(toolbarS: Selection<HTMLDivElement>) {}

  renderLegendInfo(legendS: LegendSelection) {}

  abstract getScaledValuesAtScreenPosition(horizontal: number, vertical: number) : {
    horizontal: string,
    horizontalName: string
    vertical: string,
    verticalName: string
  }

  abstract clone(): Series
}



export type ResponsiveStateArgs = {
  series: Series
  originalSeries: Series
  flipped?: ResponsiveValueUserArgs<boolean>
  currentlyFlipped?: boolean
  drawAreaWidth?: number
  drawAreaHeight?: number
}

export class ResponsiveState {
  protected _series: Series
  protected _originalSeries: Series
  protected _flipped: ResponsiveValueOptional<boolean>
  protected _currentlyFlipped: boolean
  protected _drawAreaWidth: number
  protected _drawAreaHeight: number

  constructor(args: ResponsiveStateArgs) {
    this._series = args.series
    this._originalSeries = args.originalSeries
    this._flipped = args.flipped ? validateResponsiveValue(args.flipped) : false
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
    this._currentlyFlipped = getCurrentResponsiveValue(this._flipped, {chart: this._series.renderer.chartS})
  }

  cloneProps(): ResponsiveStateArgs {
    return {
      series: this._series, originalSeries: this._originalSeries,
      flipped: this.flipped, currentlyFlipped: this.currentlyFlipped,
      drawAreaWidth: this.drawAreaWidth, drawAreaHeight: this.drawAreaHeight,
    }
  }
}
