import {RadiusArg} from "../../core/data/radius/radius-validation";
import {Series, SeriesArgs, SeriesUserArgs, SeriesValid} from "../../core/render/series";
import {ColorContinuous} from "../../core/data/color-continuous/color-continuous";

export type SeriesPointUserArgs = SeriesUserArgs & {
  radii?: RadiusArg
  color?: ColorContinuous
}

export type SeriesPointArgs = SeriesPointUserArgs & SeriesArgs

export type SeriesPointValid = SeriesValid & {
  color?: ColorContinuous
  radii: RadiusArg
}

export function seriesPointValidation(data: SeriesPointArgs): PointSeries {
  return new PointSeries(data);
}

export class PointSeries extends Series {
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

