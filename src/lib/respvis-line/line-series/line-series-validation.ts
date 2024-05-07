import {CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {PointLabelsUserArgs, PointSeries} from "respvis-point";

export type LineSeriesUserArgs = CartesianSeriesUserArgs & {
  labels?: PointLabelsUserArgs
}

export type LineSeriesArgs = LineSeriesUserArgs & CartesianSeriesArgs

export class LineSeries extends PointSeries {
  constructor(args: LineSeriesArgs | LineSeries) {
    super(args);
  }
  clone() {
    return new LineSeries(this)
  }
}

