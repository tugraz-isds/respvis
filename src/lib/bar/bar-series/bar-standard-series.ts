import {BarSeriesType} from "../../core/constants/types";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {ErrorMessages} from "../../core/utilities/error";
import {BarBaseSeries, BarBaseSeriesArgs, BarBaseSeriesUserArgs} from "./bar-base-series";
import {Rect} from "../../core";

export type BarStandardSeriesUserArgs = BarBaseSeriesUserArgs & {
  type?: 'standard'
}

export type BarStandardSeriesArgs = BarBaseSeriesArgs & BarStandardSeriesUserArgs

export class BarStandardSeries extends BarBaseSeries {
  type: BarSeriesType
  constructor(args: BarStandardSeriesArgs | BarStandardSeries) {
    super(args);
    this.type = args.type ?? 'standard'
    const { x } = this.getScaledValues()
    if(!(x instanceof ScaledValuesCategorical)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.x = x
  }

  getRect(i: number): Rect {
    return this.responsiveState.getBarRect(i)
  }

  clone() {
    return new BarStandardSeries(this)
  }
}
