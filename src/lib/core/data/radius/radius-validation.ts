import {ScaleLinear} from "d3";
import {ResponsiveValueByValueOptional} from "../responsive-value/responsive-value-value";
import {ResponsiveValueByCallback} from "../responsive-value/responsive-value-callback";

export type RadiusUnifiedArg = ResponsiveValueByValueOptional<number>
export type RadiusVaryingArg = {
  values: number[]
  scale: ResponsiveValueByCallback<ScaleLinear<number, number>>
}
export type RadiusArg = RadiusUnifiedArg | RadiusVaryingArg

export function isRadiusVaryingArg(arg: any): arg is RadiusVaryingArg {
  return typeof arg === 'object' && arg !== null && 'values' in arg && 'scale' in arg;
}

export type RadiusUnifiedValid = RadiusUnifiedArg
export type RadiusVaryingValid = RadiusVaryingArg
export type RadiusValid = RadiusUnifiedValid | RadiusVaryingValid
