import {
  CategoriesUserArgs,
  ErrorMessages,
  ScaledValuesCategorical,
  ScaledValuesCumulativeSummation,
  ScaledValuesNumeric,
} from "respvis-core";
import {createStackedBarRect} from "./bar-stacked-creation";
import {BarBaseSeries} from "../bar-base/bar-base-series";
import {Bar} from "../../bar";
import {ScaleNumeric} from "respvis-core/data/scale/scales";
import {
  BarBaseSeriesArgs,
  BarBaseSeriesData,
  BarBaseSeriesUserArgs,
  validateBarBaseSeriesArgs
} from "../bar-base/bar-base-validation";
import {cloneCartesianSeriesData} from "respvis-cartesian";

export type BarStackedSeriesUserArgs = BarBaseSeriesUserArgs & {
  type: 'stacked'
  aggregationScale?: ScaleNumeric
  categories: CategoriesUserArgs
}

export type BarStackedSeriesArgs = BarBaseSeriesArgs & BarStackedSeriesUserArgs

export type BarStackedSeriesData = BarBaseSeriesData & {
  categories: ScaledValuesCategorical
  y: ScaledValuesNumeric
  aggregationScale?: ScaleNumeric
}

function validateBarStackedSeriesArgs(args: BarStackedSeriesArgs): BarStackedSeriesData {
  const data: BarStackedSeriesData = {...validateBarBaseSeriesArgs(args),
    aggregationScale: args.aggregationScale
  } as BarStackedSeriesData
  if (!data.categories) throw new Error(ErrorMessages.missingArgumentForSeries)
  if (!(data.y instanceof ScaledValuesNumeric)) throw new Error(ErrorMessages.missingArgumentForSeries)
  return data
}

export class BarStackedSeries extends BarBaseSeries {
  originalData: BarStackedSeriesData
  renderData: BarStackedSeriesData
  type: 'stacked'
  aggScaledValues: ScaledValuesCumulativeSummation
  constructor(args: BarStackedSeriesArgs) {
    super(args);
    this.originalData = validateBarStackedSeriesArgs(args)
    this.renderData = this.originalData
    this.type = 'stacked'
    const {x, y,categories,
      aggregationScale} = this.originalData
    this.aggScaledValues = new ScaledValuesCumulativeSummation(y, x, categories, aggregationScale)
  }

  override getBars(): Bar[] {
    const {x, y,categories,
      aggregationScale} = this.renderData
    this.aggScaledValues = new ScaledValuesCumulativeSummation(y, x, categories, aggregationScale)
    return super.getBars();
  }

  getRect(i: number) {
    return createStackedBarRect({ series: this, i })
  }

  cloneToRenderData(): BarStackedSeries {
    this.renderData = cloneCartesianSeriesData(this.originalData)
    return this
  }

  applyZoom(): BarStackedSeries {
    super.applyZoom()
    return this
  }

  applyFilter(): BarStackedSeries {
    super.applyFilter()
    return this
  }

  applyInversion(): BarStackedSeries {
    throw new Error('Method not implemented')
  }
}
