import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "../../core/render/series/cartesian-series";
import {BarSeriesType} from "../../core/constants/types";
import {ScaleLinear} from "d3";

export type SeriesBarUserArgs = SeriesBarStandardUserArgs | SeriesBarGroupedUserArgs | SeriesBarStackedUserArgs

type SeriesBarStandardUserArgs = CartesianSeriesUserArgs & {
  type?: 'standard'
}

type SeriesBarGroupedUserArgs = CartesianSeriesUserArgs & {
  type: 'grouped'
}

type SeriesBarStackedUserArgs = CartesianSeriesUserArgs & {
  type: 'stacked',
  aggregationScale?: ScaleLinear<number, number, never>
}

export type SeriesBarArgs = SeriesBarUserArgs & CartesianSeriesArgs

export class BarSeries extends CartesianSeries {
  type: BarSeriesType
  aggregationScale?: ScaleLinear<number, number, never>
  constructor(args: SeriesBarArgs | BarSeries) {
    super(args);
    this.type = args.type ?? 'standard'
    this.aggregationScale = args.type === 'stacked' ? args.aggregationScale : undefined
  }

  clone() {
    return new BarSeries(this)
  }
}
