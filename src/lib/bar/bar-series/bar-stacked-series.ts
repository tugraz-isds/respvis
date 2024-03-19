import {ScaleLinear} from "d3";
import {ScaledValuesLinearUserArgs} from "../../core/data/scale/scaled-values";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {ScaledValuesLinear} from "../../core/data/scale/scaled-values-linear";
import {ErrorMessages} from "../../core/utilities/error";
import {ScaledValuesAggregation} from "../../core/data/scale/scaled-values-aggregation";
import {createStackedBar} from "./bar-creation.ts/bar-stacked-creation";
import {CategoryUserArgs} from "../../core/data/category";
import {BarBaseSeries, BarBaseSeriesArgs, BarBaseSeriesUserArgs} from "./bar-base-series";

export type BarStackedSeriesUserArgs = BarBaseSeriesUserArgs & {
  type: 'stacked'
  aggregationScale?: ScaleLinear<number, number, never>
  y: ScaledValuesLinearUserArgs
  categories: CategoryUserArgs
}

export type BarStackedSeriesArgs = BarBaseSeriesArgs & BarStackedSeriesUserArgs
export class BarStackedSeries extends BarBaseSeries {
  type: 'stacked'
  aggregationScale?: ScaleLinear<number, number, never>
  aggScaledValues: ScaledValuesAggregation
  x: ScaledValuesCategorical
  y: ScaledValuesLinear
  categories: ScaledValuesCategorical

  constructor(args: BarStackedSeriesArgs | BarStackedSeries) {
    super(args);
    this.type = 'stacked'
    this.aggregationScale = args.aggregationScale
    const { x, y } = this.getScaledValues()
    if(!(x instanceof ScaledValuesCategorical) ||
      !(y instanceof ScaledValuesLinear)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.x = x
    this.y = y
    this.categories = super.getCategories() as ScaledValuesCategorical
    if (!this.categories) throw new Error(ErrorMessages.missingArgumentForSeries)
    this.aggScaledValues = new ScaledValuesAggregation(this.y, this.x, this.categories, this.aggregationScale)
  }

  getRect(i: number) {
    return createStackedBar({
      originalScaleHandler: this.geometryScaleHandler, i,
      keysActive: this.keysActive,
      aggScaledValues: this.aggScaledValues.aggregateCached(),
      categoryDataSeries: this.categories.categories
    })
  }

  clone() {
    return new BarStackedSeries(this)
  }
}
