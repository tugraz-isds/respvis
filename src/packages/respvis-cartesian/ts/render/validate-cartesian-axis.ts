import {BaseAxis, BaseAxisArgs, BaseAxisUserArgs, validateBaseAxis} from "respvis-core";
import {CartesianSeries} from "./cartesian-series";

export type CartesianAxisUserArgs = BaseAxisUserArgs & {
  gridLineFactor?: number
}

export type CartesianAxisArgs = BaseAxisArgs & {
  series: CartesianSeries
  gridLineFactor?: number
}

export type CartesianAxis = BaseAxis & {
  series: CartesianSeries
  gridLineFactor: number | undefined
  originalAxis: CartesianAxis
}

export function validateCartesianAxis(args: CartesianAxisArgs): CartesianAxis {
  const axis = {
    ...validateBaseAxis(args),
    originalAxis: this,
    series: args.series,
    gridLineFactor: (typeof args.gridLineFactor === 'number' && args.gridLineFactor > 0.01) ?
      args.gridLineFactor : undefined
  }
  axis.originalAxis = axis
  return axis
}
