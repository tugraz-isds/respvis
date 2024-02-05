import {SeriesArgs, SeriesUserArgs, SeriesValid} from "../../core/render/series";
import {PointSeries} from "../../points";

export type LineSeriesUserArgs = SeriesUserArgs & {}

export type LineSeriesArgs = LineSeriesUserArgs & SeriesArgs

export type LineSeriesValid = SeriesValid & {}

export function lineSeriesValidation(data: LineSeriesArgs) {
  return new LineSeries(data);
}

export class LineSeries extends PointSeries {
  clone() {
    return new LineSeries(this)
  }
}

