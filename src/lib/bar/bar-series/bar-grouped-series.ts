import {ScaledValuesCategorical} from "core/data/scale/scaled-values-categorical";
import {ErrorMessages} from "core/utilities/error";
import {createGroupedBar} from "./bar-creation.ts/bar-grouped-creation";
import {CategoryUserArgs} from "core/data/category";
import {BarBaseSeries, BarBaseSeriesArgs, BarBaseSeriesUserArgs} from "./bar-base-series";

export type BarGroupedSeriesUserArgs = BarBaseSeriesUserArgs & {
  type: 'grouped'
  categories: CategoryUserArgs
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
    return createGroupedBar({series: this, i})
  }

  clone() {
    return new BarGroupedSeries(this)
  }
}
