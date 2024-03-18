import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "../../core/render/series/cartesian-series";
import {ScaleLinear} from "d3";
import {ScaledValuesCategoricalUserArgs, ScaledValuesLinearUserArgs} from "../../core/data/scale/scaled-values";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {ScaledValuesLinear} from "../../core/data/scale/scaled-values-linear";
import {ErrorMessages} from "../../core/utilities/error";

export type BarStackedSeriesUserArgs = CartesianSeriesUserArgs & {
  type: 'stacked'
  aggregationScale?: ScaleLinear<number, number, never>
  x: ScaledValuesCategoricalUserArgs
  y: ScaledValuesLinearUserArgs
}

export type BarStackedSeriesArgs = BarStackedSeriesUserArgs & CartesianSeriesArgs
export class BarStackedSeries extends CartesianSeries {
  type: 'stacked'
  aggregationScale?: ScaleLinear<number, number, never>
  x: ScaledValuesCategorical
  y: ScaledValuesLinear
  constructor(args: BarStackedSeriesArgs | BarStackedSeries) {
    super(args);
    this.type = 'stacked'
    this.aggregationScale = args.aggregationScale
    const { x, y } = this.getScaledValues()
    if(!(x instanceof ScaledValuesCategorical) ||
      !(y instanceof ScaledValuesLinear)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.x = x
    this.y = y
  }

  clone() {
    return new BarStackedSeries(this)
  }
}
