import {
  BaseAxis,
  BaseAxisArgs,
  BaseAxisUserArgs,
  ResponsiveValueOptional,
  ResponsiveValueUserArgs,
  validateBaseAxis,
  validateResponsiveValue
} from "respvis-core";
import {CartesianSeries} from "./cartesian-series";

export type CartesianAxisUserArgs = BaseAxisUserArgs & {
  gridLineFactor?: number
  inverted?: ResponsiveValueUserArgs<boolean>
}

export type CartesianAxisArgs = BaseAxisArgs & Pick<CartesianAxisUserArgs, 'gridLineFactor' | 'inverted'> & {
  series: CartesianSeries
}

export type CartesianAxis = BaseAxis & {
  series: CartesianSeries
  gridLineFactor: number | undefined
  inverted: ResponsiveValueOptional<boolean>
  originalAxis: CartesianAxis
}

export function validateCartesianAxis(args: CartesianAxisArgs): CartesianAxis {
  const axis = {
    ...validateBaseAxis(args),
    inverted: validateResponsiveValue(args.inverted ?? false),
    originalAxis: this,
    series: args.series,
    gridLineFactor: (typeof args.gridLineFactor === 'number' && args.gridLineFactor > 0.01) ?
      args.gridLineFactor : undefined
  }
  axis.originalAxis = axis
  return axis
}
