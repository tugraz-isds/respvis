import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "../../core/render/series/cartesian-series";
import {BarSeriesType} from "../../core/constants/types";

export type SeriesBarUserArgs = CartesianSeriesUserArgs & {
  type?: BarSeriesType
}

export type SeriesBarArgs = SeriesBarUserArgs & CartesianSeriesArgs

export class BarSeries extends CartesianSeries {
  type: BarSeriesType
  constructor(args: SeriesBarArgs | BarSeries) {
    super(args);
    this.type = args.type ?? 'standard'
  }

  clone() {
    return new BarSeries(this)
  }
}
