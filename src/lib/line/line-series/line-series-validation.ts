import {CartesianSeriesArgs, CartesianSeriesUserArgs} from "../../cartesian/cartesian-series";
import {PointSeries} from "../../point";
import {PointLabelsUserArgs} from "../../point/point-label";

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

