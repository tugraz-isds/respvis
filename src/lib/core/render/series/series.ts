import {CategoryUserArgs} from "../../data/category";
import {SeriesConfigTooltips, seriesConfigTooltipsData} from "../../../tooltip";
import {Point} from "../../../point";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {RenderArgs, Renderer} from "../charts/renderer";
import {ActiveKeyMap, SeriesKey} from "../../constants/types";
import {Size} from "../../utilities/size";
import {ScaledValuesCategorical} from "../../data/scale/scaled-values-categorical";
import {mergeKeys} from "../../utilities/dom/key";

export type SeriesUserArgs = {
  categories?: CategoryUserArgs
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>
  labelCallback?: (category: string) => string,
  flipped?: RespValByValueOptional<boolean>
}

export type SeriesArgs = SeriesUserArgs & RenderArgs & {
  key: SeriesKey
  bounds?: Size,
}

export type SeriesValid = Required<Omit<SeriesArgs, 'markerTooltips' | 'flipped' | 'categories'>> & {
  categories?: ScaledValuesCategorical
  markerTooltips: SeriesConfigTooltips<SVGCircleElement, Point>
  flipped: RespValByValueOptional<boolean>
  keysActive: ActiveKeyMap,
  getCombinedKey: (i: number) => string
}

export abstract class Series implements RenderArgs, SeriesValid {
  categories?: ScaledValuesCategorical
  key: SeriesKey;
  keysActive: ActiveKeyMap
  bounds: Size;
  markerTooltips: SeriesConfigTooltips<SVGCircleElement, Point>
  labelCallback: (category: string) => string
  flipped: RespValByValueOptional<boolean>
  renderer: Renderer

  constructor(args: SeriesArgs | Series) {
    const {key, labelCallback} = args

    //TODO: pass correct parameters here
    if (args instanceof Series) this.categories = args.categories
    else this.categories = args.categories ? new ScaledValuesCategorical({
      ...args.categories, parentKey: key,
    }) : undefined

    this.bounds = args.bounds || {width: 600, height: 400}
    this.key = args.key

    if (args instanceof Series) this.keysActive = args.keysActive
    else {
      this.keysActive = {}
      this.keysActive[key] = true
    }
    this.markerTooltips = args instanceof Series ? args.markerTooltips : seriesConfigTooltipsData(args.markerTooltips)
    this.labelCallback = args instanceof Series ? args.labelCallback : (labelCallback ?? ((label: string) => label))
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

  abstract clone(): Series
}
