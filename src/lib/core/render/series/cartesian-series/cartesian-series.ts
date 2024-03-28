import {AxisDomainRV, axisScaledValuesValidation} from "../../../data/scale/axis-scaled-values-validation";
import {alignScaledValuesLengths, ScaledValuesUserArgs} from "../../../data/scale/scaled-values";
import {combineKeys} from "../../../utilities/dom/key";
import {ScaledValues} from "../../../data/scale/scaled-values-base";
import {ScaledValuesCategorical} from "../../../data/scale/scaled-values-categorical";
import {Series, SeriesArgs, SeriesUserArgs} from "../index";
import {CartesianSeriesResponsiveState} from "./responsive-state";

export type CartesianSeriesUserArgs = SeriesUserArgs & {
  x: ScaledValuesUserArgs<AxisDomainRV>
  y: ScaledValuesUserArgs<AxisDomainRV>
}

export type CartesianSeriesArgs = SeriesArgs & CartesianSeriesUserArgs

export class CartesianSeries extends Series {
  x: ScaledValues
  y: ScaledValues
  responsiveState: CartesianSeriesResponsiveState

  constructor(args: CartesianSeriesArgs | CartesianSeries) {
    super(args)
    const [xAligned, yAligned] = ('tag' in args.x && 'tag' in args.y) ? [args.x, args.y] :
      alignScaledValuesLengths(args.x, args.y)
    this.x = 'tag' in xAligned ? xAligned : axisScaledValuesValidation(xAligned, 'a-0')
    this.y = 'tag' in yAligned ? yAligned : axisScaledValuesValidation(yAligned, 'a-1')
    this.responsiveState = 'class' in args ? args.responsiveState : new CartesianSeriesResponsiveState({
      flipped: args.flipped, series: this
    })
  }

  getScaledValues() { return {x: this.x, y: this.y} }

  getCombinedKey(i: number) {
    const xKey = this.x instanceof ScaledValuesCategorical ? this.x.getCategoryData(i).combinedKey : undefined
    const yKey = this.y instanceof ScaledValuesCategorical ? this.y.getCategoryData(i).combinedKey : undefined
    const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
    return combineKeys([this.key, seriesCategoryKey, xKey, yKey])
  }

  getScaledValuesAtScreenPosition(x: number, y: number) {
    return {
      x: this.x.scaledValueAtScreenPosition(x),
      y: this.y.scaledValueAtScreenPosition(y)
    }
  }

  clone() {
    return new CartesianSeries(this)
  }
}
