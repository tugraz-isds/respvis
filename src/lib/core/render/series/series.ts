import {Size} from "../../utilities/size";
import {SeriesConfigTooltips, seriesConfigTooltipsData} from "../../../tooltip";
import {RenderArgs, Renderer} from "../charts/renderer";
import {Point} from "../../../points";
import {AxisDomainRV, axisScaledValuesValidation} from "../../data/scale/axis-scaled-values-validation";
import {CategoryUserArgs} from "../../data/category";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {alignScaledValuesLengths, ScaledValuesUserArgs} from "../../data/scale/scaled-values";
import {ActiveKeyMap, SeriesKey} from "../../constants/types";
import {combineKeys, mergeKeys} from "../../utilities/dom/key";
import {ScaledValuesBase} from "../../data/scale/scaled-values-base";
import {ScaledValuesCategorical} from "../../data/scale/scaled-values-categorical";

//TODO: Maybe rename series to cartesian series because of x and y values?
export type SeriesUserArgs = {
  x: ScaledValuesUserArgs<AxisDomainRV>
  y: ScaledValuesUserArgs<AxisDomainRV>
  categories?: CategoryUserArgs
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>
  labelCallback?: (category: string) => string,
  flipped?: RespValByValueOptional<boolean>
}

export type SeriesArgs = SeriesUserArgs & RenderArgs & {
  key: SeriesKey
  bounds?: Size,
}

export type SeriesValid = Required<Omit<SeriesArgs, 'markerTooltips' | 'flipped' | 'x' | 'y' | 'categories'>> & {
  x: ScaledValuesBase<AxisDomainRV>
  y: ScaledValuesBase<AxisDomainRV>
  categories?: ScaledValuesCategorical
  markerTooltips: SeriesConfigTooltips<SVGCircleElement, Point>
  flipped: RespValByValueOptional<boolean>
  keysActive: ActiveKeyMap,
  getCombinedKey: (i: number) => string
}

export function seriesValidation(data: SeriesArgs): Series {
  return new Series(data)
}


export class Series implements RenderArgs, Required<Omit<SeriesArgs, 'markerTooltips' | 'flipped' | 'x' | 'y' | 'categories'>> {
  x: ScaledValuesBase<AxisDomainRV>
  y: ScaledValuesBase<AxisDomainRV>
  categories?: ScaledValuesCategorical
  key: `s-${number}`;
  keysActive: ActiveKeyMap
  bounds: Size;
  markerTooltips: SeriesConfigTooltips<SVGCircleElement, Point>
  labelCallback: (category: string) => string
  flipped: RespValByValueOptional<boolean>
  renderer: Renderer

  constructor(args: SeriesArgs | Series) {
    const {key, labelCallback, categories} = args
    const [xAligned, yAligned] = alignScaledValuesLengths(args.x, args.y)
    this.x = xAligned instanceof ScaledValuesBase ? xAligned : axisScaledValuesValidation(xAligned, 'a-0')
    this.y = yAligned instanceof ScaledValuesBase ? yAligned : axisScaledValuesValidation(yAligned, 'a-1')

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

  getCombinedKey(i: number) {
    const xKey = this.x instanceof ScaledValuesCategorical ? this.x.getCategoryData(i).combinedKey : undefined
    const yKey = this.y instanceof ScaledValuesCategorical ? this.y.getCategoryData(i).combinedKey : undefined
    const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
    return combineKeys([this.key, seriesCategoryKey, xKey, yKey])
  }

  getMergedKeys() {
    if (this.categories) {
      return this.categories.categories.keyOrder.map(cKey =>
        mergeKeys([this.key, cKey]))
    }
    return [this.key]
  }

  clone() {
    return new Series(this)
  }
}
