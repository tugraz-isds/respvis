import {
  CategoriesUserArgs,
  ErrorMessages,
  ScaledValuesCategorical,
  ScaledValuesCumulativeSummation,
  ScaledValuesNumeric,
} from "respvis-core";
import {createStackedBarRect} from "./bar-stacked-creation";
import {BarBaseSeries, BarBaseSeriesArgs, BarBaseSeriesUserArgs} from "../bar-base/bar-base-series";
import {Bar} from "../../bar";
import {ScaleNumeric} from "respvis-core/data/scale/scales";

export type BarStackedSeriesUserArgs = BarBaseSeriesUserArgs & {
  type: 'stacked'
  aggregationScale?: ScaleNumeric
  categories: CategoriesUserArgs
}

export type BarStackedSeriesArgs = BarBaseSeriesArgs & BarStackedSeriesUserArgs
export class BarStackedSeries extends BarBaseSeries {
  type: 'stacked'
  aggregationScale?: ScaleNumeric
  aggScaledValues: ScaledValuesCumulativeSummation
  x: ScaledValuesCategorical
  y: ScaledValuesNumeric
  categories: ScaledValuesCategorical

  constructor(args: BarStackedSeriesArgs | BarStackedSeries) {
    super(args);
    this.type = 'stacked'
    this.aggregationScale = args.aggregationScale
    const { x, y } = this.getScaledValues()
    if(!(x instanceof ScaledValuesCategorical) ||
      !(y instanceof ScaledValuesNumeric)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.x = x
    this.y = y
    this.categories = super.getCategories() as ScaledValuesCategorical
    if (!this.categories) throw new Error(ErrorMessages.missingArgumentForSeries)
    this.aggScaledValues = new ScaledValuesCumulativeSummation(this.y, this.x, this.categories, this.aggregationScale)
  }

  override getBars(): Bar[] {
    this.aggScaledValues = new ScaledValuesCumulativeSummation(this.y, this.x, this.categories, this.aggregationScale)
    return super.getBars();
  }

  getRect(i: number) {
    return createStackedBarRect({ series: this, i })
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
