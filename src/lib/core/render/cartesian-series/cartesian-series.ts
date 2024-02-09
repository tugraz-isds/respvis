import {RenderArgs} from "../chart/renderer";
import {AxisDomainRV, axisScaledValuesValidation} from "../../data/scale/axis-scaled-values-validation";
import {alignScaledValuesLengths, ScaledValuesUserArgs} from "../../data/scale/scaled-values";
import {combineKeys} from "../../utilities/dom/key";
import {ScaledValuesBase} from "../../data/scale/scaled-values-base";
import {ScaledValuesCategorical} from "../../data/scale/scaled-values-categorical";
import {Series, SeriesArgs, SeriesUserArgs, SeriesValid} from "../series";

export type CartesianSeriesUserArgs = SeriesUserArgs & {
  x: ScaledValuesUserArgs<AxisDomainRV>
  y: ScaledValuesUserArgs<AxisDomainRV>
}

export type CartesianSeriesArgs = SeriesArgs & CartesianSeriesUserArgs

export type CartesianSeriesValid = SeriesValid & {
  x: ScaledValuesBase<AxisDomainRV>
  y: ScaledValuesBase<AxisDomainRV>
}

export class CartesianSeries extends Series implements RenderArgs, CartesianSeriesValid {
  x: ScaledValuesBase<AxisDomainRV>
  y: ScaledValuesBase<AxisDomainRV>

  constructor(args: CartesianSeriesArgs | CartesianSeries) {
    super(args)
    const [xAligned, yAligned] = alignScaledValuesLengths(args.x, args.y)
    this.x = xAligned instanceof ScaledValuesBase ? xAligned : axisScaledValuesValidation(xAligned, 'a-0')
    this.y = yAligned instanceof ScaledValuesBase ? yAligned : axisScaledValuesValidation(yAligned, 'a-1')
  }

  getCombinedKey(i: number) {
    const xKey = this.x instanceof ScaledValuesCategorical ? this.x.getCategoryData(i).combinedKey : undefined
    const yKey = this.y instanceof ScaledValuesCategorical ? this.y.getCategoryData(i).combinedKey : undefined
    const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
    return combineKeys([this.key, seriesCategoryKey, xKey, yKey])
  }

  clone() {
    return new CartesianSeries(this)
  }
}
