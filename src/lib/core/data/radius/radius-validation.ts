import {ResponsiveValueByCallback, ResponsiveValueByValueOptional} from "../breakpoint/responsive-value";
import {ScaleLinear} from "d3";

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
