import {CategoriesUserArgs, ErrorMessages, ScaledValuesCategorical} from "respvis-core";
import {createGroupedBarRect} from "./bar-grouped-creation";
import {BarBaseSeries, BarBaseSeriesArgs, BarBaseSeriesUserArgs} from "../bar-base/bar-base-series";

export type BarGroupedSeriesUserArgs = BarBaseSeriesUserArgs & {
  type: 'grouped'
  categories: CategoriesUserArgs
}

export type BarGroupedSeriesArgs = BarBaseSeriesArgs & BarGroupedSeriesUserArgs

export class BarGroupedSeries extends BarBaseSeries {
  type: 'grouped'
  categories: ScaledValuesCategorical

  constructor(args: BarGroupedSeriesArgs | BarGroupedSeries) {
    super(args);
    this.type = 'grouped'
    this.categories = super.getCategories() as ScaledValuesCategorical
    if (!this.categories) throw new Error(ErrorMessages.missingArgumentForSeries)
  }

  getRect(i: number) {
    return createGroupedBarRect(this, i)
  }

  clone() {
    return new BarGroupedSeries(this)
  }
}
