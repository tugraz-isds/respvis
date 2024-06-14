import {ColorContinuous, RadiusArg} from "respvis-core";
import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {PointLabelsDataCollection, PointLabelsUserArgs} from "../point-label";

export type PointSeriesUserArgs = CartesianSeriesUserArgs & {
  radii?: RadiusArg
  //TODO: Refactor ColorContinuous
  color?: ColorContinuous
  labels?: PointLabelsUserArgs
}

export type PointSeriesArgs = PointSeriesUserArgs & CartesianSeriesArgs

export class PointSeries extends CartesianSeries {
  color?: ColorContinuous
  radii: RadiusArg
  labels?: PointLabelsDataCollection
  //TODO: Do clean radius validation
  constructor(args: PointSeriesArgs | PointSeries) {
    super(args)
    this.radii = args.radii ?? 5
    this.color = args.color

    if ('class' in args) this.labels = args.labels
    else if (args.labels) this.labels = new PointLabelsDataCollection(args.labels)
  }

  clone() {
    return new PointSeries(this)
  }
}

