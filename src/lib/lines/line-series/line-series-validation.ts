import {CartesianSeriesArgs, CartesianSeriesUserArgs, CartesianSeriesValid} from "../../core/render/cartesian-series";
import {PointSeries} from "../../points";

export type LineSeriesUserArgs = CartesianSeriesUserArgs & {}

export type LineSeriesArgs = LineSeriesUserArgs & CartesianSeriesArgs

export type LineSeriesValid = CartesianSeriesValid & {}

export function lineSeriesValidation(data: LineSeriesArgs) {
  return new LineSeries(data);
}

export class LineSeries extends PointSeries {
  clone() {
    return new LineSeries(this)
  }
}

