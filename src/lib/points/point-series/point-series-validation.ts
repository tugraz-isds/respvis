import {RadiusArg} from "../../core/data/radius/radius-validation";
import {SeriesArgs, SeriesUserArgs, SeriesValid, seriesValidation} from "../../core/render/series";
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

export function seriesPointValidation(data: SeriesPointArgs): SeriesPointValid {
  const {radii, color} = data
  //TODO: Do clean radius validation
  return {
    ...seriesValidation(data),
    radii: radii !== undefined ? radii : 5,
    color,
  };
}


