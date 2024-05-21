import {ScaleLinear} from "d3";
import {
  CategoriesUserArgs,
  ErrorMessages,
  ScaledValuesAggregation,
  ScaledValuesCategorical,
  ScaledValuesLinear,
  ScaledValuesLinearUserArgs
} from "respvis-core";
import {createStackedBar} from "./bar-creation.ts/bar-stacked-creation";
import {BarBaseSeries, BarBaseSeriesArgs, BarBaseSeriesUserArgs} from "./bar-base-series";
import {Bar} from "../bar";

export type BarStackedSeriesUserArgs = BarBaseSeriesUserArgs & {
  type: 'stacked'
  aggregationScale?: ScaleLinear<number, number, never>
  y: ScaledValuesLinearUserArgs
  categories: CategoriesUserArgs
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

  override getBarRects(): Bar[] {
    this.aggScaledValues = new ScaledValuesAggregation(this.y, this.x, this.categories, this.aggregationScale)
    return super.getBarRects();
  }

  getRect(i: number) {
    return createStackedBar({ series: this, i })
  }

  cloneZoomed(): BarStackedSeries {
    return this.clone()
    //TODO: implement correct zooming for stacked bar series
    // if (!this.zoom || !this.aggregationScale) return super.cloneZoomed()
    // const clone = this.clone()
    // const flipped = this.responsiveState.currentlyFlipped
    // const aggScaleZoomed = flipped ?
    //   this.zoom.currentTransform.rescaleX(this.aggregationScale) : this.zoom.currentTransform.rescaleY(this.aggregationScale)
    // clone.aggregationScale = aggScaleZoomed
    // return clone
  }

  clone() {
    return new BarStackedSeries(this)
  }
}
