import {CategoriesUserArgs, ErrorMessages, ScaledValuesCategorical} from "respvis-core";
import {createGroupedBarRect} from "./bar-grouped-creation";
import {BarBaseSeries} from "../bar-base/bar-base-series";
import {
  BarBaseSeriesArgs,
  BarBaseSeriesData,
  BarBaseSeriesUserArgs,
  validateBarBaseSeriesArgs
} from "../bar-base/bar-base-validation";
import {cloneCartesianSeriesData} from "respvis-cartesian";

export type BarGroupedSeriesUserArgs = BarBaseSeriesUserArgs & {
  type: 'grouped'
  categories: CategoriesUserArgs
}

export type BarGroupedSeriesArgs = BarBaseSeriesArgs & BarGroupedSeriesUserArgs

export type BarGroupedSeriesData = BarBaseSeriesData & {
  categories: ScaledValuesCategorical
}

function validateBarGroupedSeriesArgs(args: BarGroupedSeriesArgs): BarGroupedSeriesData {
  const data: BarGroupedSeriesData = validateBarBaseSeriesArgs(args) as BarGroupedSeriesData
  if (!data.categories) throw new Error(ErrorMessages.missingArgumentForSeries)
  return data
}

export class BarGroupedSeries extends BarBaseSeries {
  type: 'grouped'
  originalData: BarGroupedSeriesData
  renderData: BarGroupedSeriesData

  constructor(args: BarGroupedSeriesArgs) {
    super(args);
    this.type = 'grouped'
    this.originalData = validateBarGroupedSeriesArgs(args)
    this.renderData = this.originalData
  }

  getRect(i: number) {
    return createGroupedBarRect(this, i)
  }

  cloneToRenderData(): BarGroupedSeries {
    this.renderData = cloneCartesianSeriesData(this.originalData)
    return this
  }

  applyZoom(): BarGroupedSeries {
    super.applyZoom()
    return this
  }

  applyFilter(): BarGroupedSeries {
    super.applyFilter()
    return this
  }

  applyInversion(): BarGroupedSeries {
    throw new Error('Method not implemented')
  }
}
