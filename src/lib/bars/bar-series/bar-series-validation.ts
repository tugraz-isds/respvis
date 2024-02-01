import {Rect,} from '../../core/utilities/rect';
import {SeriesArgs, SeriesUserArgs, SeriesValid, seriesValidation} from "../../core/render/series";
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

export function seriesBarValidation(data: SeriesBarArgs): SeriesBarValid {
  return {
    type: data.type ?? 'standard',
    ...seriesValidation(data)
  };
}
