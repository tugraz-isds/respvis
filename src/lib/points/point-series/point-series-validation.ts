import {RadiusArg} from "../../core/data/radius/radius-validation";
import {
  CartesianSeries,
  CartesianSeriesArgs,
  CartesianSeriesUserArgs,
  CartesianSeriesValid
} from "../../core/render/cartesian-series";
import {ColorContinuous} from "../../core/data/color-continuous/color-continuous";

export type SeriesPointUserArgs = CartesianSeriesUserArgs & {
  radii?: RadiusArg
  color?: ColorContinuous
}

export type SeriesPointArgs = SeriesPointUserArgs & CartesianSeriesArgs

export type SeriesPointValid = CartesianSeriesValid & {
  color?: ColorContinuous
  radii: RadiusArg
}

export function seriesPointValidation(data: SeriesPointArgs): PointSeries {
  return new PointSeries(data);
}

export class PointSeries extends CartesianSeries {
  color?: ColorContinuous
  radii: RadiusArg
  //TODO: Do clean radius validation
  constructor(args: SeriesPointArgs | PointSeries) {
    super(args)
    this.radii = args.radii ?? 5
    this.color = args.color
  }

  clone() {
    return new PointSeries(this)
  }
}

