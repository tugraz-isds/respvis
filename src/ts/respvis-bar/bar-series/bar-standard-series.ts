import {BarSeriesType, ErrorMessages, Rect, ScaledValuesCategorical} from "respvis-core";
import {BarBaseSeries, BarBaseSeriesArgs, BarBaseSeriesUserArgs} from "respvis-bar/bar-series/bar-base/bar-base-series";

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
