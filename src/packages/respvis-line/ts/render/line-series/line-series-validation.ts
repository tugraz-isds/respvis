import {CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {PointLabelsUserArgs, PointSeries} from "respvis-point";
import {InterpolatedRadius, InterpolatedRadiusUserArgs, validateRespValInterpolated} from "respvis-core";

export type LineSeriesUserArgs = CartesianSeriesUserArgs & {
  labels?: PointLabelsUserArgs
  radii?: InterpolatedRadiusUserArgs
}

export type LineSeriesArgs = LineSeriesUserArgs & Omit<CartesianSeriesArgs, 'originalSeries'> & {
  originalSeries?: LineSeries
}

export class LineSeries extends PointSeries {
  radii: InterpolatedRadius
  originalSeries: LineSeries
  constructor(args: LineSeriesArgs | LineSeries) {
    super(args);
    this.originalSeries = args.originalSeries ?? this
    if ('class' in args) this.radii = args.radii
    else this.radii = args.radii ? validateRespValInterpolated(args.radii) : 5
  }
  clone() {
    return new LineSeries(this)
  }
}

