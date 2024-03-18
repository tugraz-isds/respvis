import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "../../core/render/series/cartesian-series";
import {BarSeriesType} from "../../core/constants/types";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {ScaledValuesCategoricalUserArgs} from "../../core/data/scale/scaled-values";
import {ErrorMessages} from "../../core/utilities/error";

export type BarStandardSeriesUserArgs = CartesianSeriesUserArgs & {
  type?: 'standard'
  x: ScaledValuesCategoricalUserArgs
}

export type BarStandardSeriesArgs = BarStandardSeriesUserArgs & CartesianSeriesArgs

export class BarStandardSeries extends CartesianSeries {
  type: BarSeriesType
  x: ScaledValuesCategorical
  constructor(args: BarStandardSeriesArgs | BarStandardSeries) {
    super(args);
    this.type = args.type ?? 'standard'
    const { x, y } = this.getScaledValues()
    if(!(x instanceof ScaledValuesCategorical)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.x = x
  }

  clone() {
    return new BarStandardSeries(this)
  }
}
