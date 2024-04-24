import {BaseAxisArgs, BaseAxisUserArgs, BaseAxisValid, baseAxisValidation} from "../core";
import {CartesianSeries} from "../core/render/series/cartesian-series";

export type CartesianAxisUserArgs = BaseAxisUserArgs & {
  gridLineFactor?: number
}

export type CartesianAxisArgs = BaseAxisArgs & {
  series: CartesianSeries
  gridLineFactor?: number
}

export type CartesianAxisValid = BaseAxisValid & {
  series: CartesianSeries
  gridLineFactor: number | undefined
}

export function cartesianAxisValidation(args: CartesianAxisArgs): CartesianAxisValid {
  return {
    ...baseAxisValidation(args),
    series: args.series,
    gridLineFactor: args.gridLineFactor
  }
}
