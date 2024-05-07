import {RadiusArg} from "respvis-core/data/radius/radius-validation";
import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "../../cartesian/cartesian-series";
import {ColorContinuous} from "respvis-core/data/color-continuous/color-continuous";
import {PointLabelsUserArgs, PointLabelValues} from "../point-label";

export type SeriesPointUserArgs = CartesianSeriesUserArgs & {
  radii?: RadiusArg
  color?: ColorContinuous
  labels?: PointLabelsUserArgs
}

export type SeriesPointArgs = SeriesPointUserArgs & CartesianSeriesArgs

export class PointSeries extends CartesianSeries {
  color?: ColorContinuous
  radii: RadiusArg
  labels?: PointLabelValues
  //TODO: Do clean radius validation
  constructor(args: SeriesPointArgs | PointSeries) {
    super(args)
    this.radii = args.radii ?? 5
    this.color = args.color

    if ('class' in args) this.labels = args.labels
    else if (args.labels) this.labels = new PointLabelValues(args.labels)
  }

  clone() {
    return new PointSeries(this)
  }
}

