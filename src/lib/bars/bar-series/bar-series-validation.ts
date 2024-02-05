import {Rect,} from '../../core/utilities/rect';
import {Series, SeriesArgs, SeriesUserArgs, SeriesValid} from "../../core/render/series";
import {BarSeriesType} from "../../core/constants/types";

export interface Bar extends Rect {
  xValue: any
  yValue: any
  label: string
  styleClass: string;
  key: string;
}

export type SeriesBarUserArgs = SeriesUserArgs & {
  type?: BarSeriesType
}

export type SeriesBarArgs = SeriesBarUserArgs & SeriesArgs

export type SeriesBarValid = SeriesValid & {
  type: BarSeriesType
}

export function seriesBarValidation(data: SeriesBarArgs): BarSeries {
  return new BarSeries(data)
}

export class BarSeries extends Series {
  type: BarSeriesType
  constructor(args: SeriesBarArgs | BarSeries) {
    super(args);
    this.type = args.type ?? 'standard'
  }

  clone() {
    return new BarSeries(this)
  }
}
