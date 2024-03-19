import {CategoryUserArgs} from "../../data/category";
import {SeriesConfigTooltips, seriesConfigTooltipsData} from "../../../tooltip";
import {Point} from "../../../point";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {RenderArgs, Renderer} from "../chart/renderer";
import {ActiveKeyMap, SeriesKey} from "../../constants/types";
import {Size} from "../../utilities/size";
import {ScaledValuesCategorical} from "../../data/scale/scaled-values-categorical";
import {mergeKeys} from "../../utilities/dom/key";

export type SeriesUserArgs = {
  categories?: CategoryUserArgs
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>
  labelCallback?: (category: string) => string
  flipped?: RespValByValueOptional<boolean>
}

export type SeriesArgs = SeriesUserArgs & RenderArgs & {
  key: SeriesKey
  bounds?: Size
}

export abstract class Series implements RenderArgs {
  class = true
  categories?: ScaledValuesCategorical
  key: SeriesKey
  keysActive: ActiveKeyMap
  bounds: Size
  markerTooltips: SeriesConfigTooltips<SVGCircleElement, Point>
  labelCallback: (category: string) => string
  flipped: RespValByValueOptional<boolean>
  renderer: Renderer

  constructor(args: SeriesArgs | Series) {
    const {key, labelCallback} = args

    //TODO: pass correct parameters here
    if ('class' in args) this.categories = args.categories
    else this.categories = args.categories ? new ScaledValuesCategorical({
      ...args.categories, parentKey: key,
    }) : undefined

    this.bounds = args.bounds || {width: 600, height: 400}
    this.key = args.key

    if ('class' in args) this.keysActive = args.keysActive
    else {
      this.keysActive = {}
      this.keysActive[key] = true
    }
    this.markerTooltips = 'class' in args ? args.markerTooltips : seriesConfigTooltipsData(args.markerTooltips)
    this.labelCallback = 'class' in args ? args.labelCallback : (labelCallback ?? ((label: string) => label))
    this.renderer = args.renderer
    this.flipped = args.flipped ?? false
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

  abstract getScaledValuesAtScreenPosition(x: number, y: number) : { x: string, y: string }

  abstract clone(): Series
}
