import {ScaleBand, ScaleLinear, ScaleTime} from "d3";
import {ScaledValuesSpatialDomain} from "./scaled-values-spatial/validate-scaled-values-spatial";

export type ScaledNumeric<T extends number | Date> =
  T extends Date ? ScaleTime<number, number, never> :
    T extends number ? ScaleLinear<number, number, never> : never

export type ScaleBase<T extends ScaledValuesSpatialDomain> =
  T extends Date | number ? ScaledNumeric<T> :
    T extends string ? ScaleBand<string> : never


export function isScale(arg: any) {
  return 'domain' in arg && 'range' in arg
}

export function isScaleLinear(arg: any): arg is ScaleLinear<number, number, never> {
  return isScale(arg) && typeof arg.domain()[0] === 'number'
}

export function isScaleCategory(arg: any): arg is ScaleBand<string> {
  return isScale(arg) && typeof arg.domain()[0] === 'string'
}

export function isScaleTime(arg: any): arg is ScaleTime<number, number, never> {
  return isScale(arg) && arg.domain()[0] instanceof Date
}

