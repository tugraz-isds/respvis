import {BaseAxisArgs, BaseAxisUserArgs, BaseAxisValid, baseAxisValidation} from "respvis-core";
import {CartesianSeries} from "./cartesian-series";

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
