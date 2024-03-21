import {CartesianSeriesArgs, CartesianSeriesUserArgs} from "../../core/render/series/cartesian-series";
import {PointSeries} from "../../point";

export type LineSeriesUserArgs = CartesianSeriesUserArgs & {}

export type LineSeriesArgs = LineSeriesUserArgs & CartesianSeriesArgs

export class LineSeries extends PointSeries {
  constructor(args: LineSeriesArgs | LineSeries) {
    super(args);
  }
  clone() {
    return new LineSeries(this)
  }
}

