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
  originalAxis: CartesianAxisValid
}

export function cartesianAxisValidation(args: CartesianAxisArgs): CartesianAxisValid {
  const axis = {
    ...baseAxisValidation(args),
    originalAxis: this,
    series: args.series,
    gridLineFactor: args.gridLineFactor
  }
  axis.originalAxis = axis
  return axis
}
