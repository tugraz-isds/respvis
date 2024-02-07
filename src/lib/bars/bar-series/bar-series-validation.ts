import {Rect,} from '../../core/utilities/rect';
import {
  CartesianSeries,
  CartesianSeriesArgs,
  CartesianSeriesUserArgs,
  CartesianSeriesValid
} from "../../core/render/cartesian-series";
import {BarSeriesType} from "../../core/constants/types";

export interface Bar extends Rect {
  xValue: any
  yValue: any
  label: string
  styleClass: string;
  key: string;
}

export type SeriesBarUserArgs = CartesianSeriesUserArgs & {
  type?: BarSeriesType
}

export type SeriesBarArgs = SeriesBarUserArgs & CartesianSeriesArgs

export type SeriesBarValid = CartesianSeriesValid & {
  type: BarSeriesType
}

export function seriesBarValidation(data: SeriesBarArgs): BarSeries {
  return new BarSeries(data)
}

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
