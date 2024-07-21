import {ScaleBand, ScaleLinear, ScaleLogarithmic, ScalePower, ScaleTime} from "d3";
import {ScaledValuesSpatialDomain} from "./scaled-values-spatial/validate-scaled-values-spatial";

export type ScaleNumeric = ScaleLinear<number, number, never> | ScaleLogarithmic<number, number, never> |
  ScalePower<number, number, never>

export type ScaleNumericOrTemporal<T extends number | Date> =
  T extends Date ? ScaleTime<number, number, never> :
    T extends number ? ScaleNumeric : never

export type ScaleBase<T extends ScaledValuesSpatialDomain> =
  T extends Date | number ? ScaleNumericOrTemporal<T> :
    T extends string ? ScaleBand<string> : never


export function isScale(arg: any) {
  return 'domain' in arg && 'range' in arg
}

export function isScaleNumeric(arg: any): arg is ScaleNumeric {
  return isScale(arg) && typeof arg.domain()[0] === 'number'
}

export function isScaleCategory(arg: any): arg is ScaleBand<string> {
  return isScale(arg) && typeof arg.domain()[0] === 'string'
}

export function isScaleTime(arg: any): arg is ScaleTime<number, number, never> {
  return isScale(arg) && arg.domain()[0] instanceof Date
}

