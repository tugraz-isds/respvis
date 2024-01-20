import {ScaleLinear} from "d3";
import {RespValByValueOptional} from "../responsive-value/responsive-value-value";
import {RespValByCallback} from "../responsive-value/responsive-value-callback";

export type RadiusUnifiedArg = RespValByValueOptional<number>
export type RadiusVaryingArg = {
  values: number[]
  scale: RespValByCallback<ScaleLinear<number, number>>
}
export type RadiusArg = RadiusUnifiedArg | RadiusVaryingArg

export function isRadiusVaryingArg(arg: any): arg is RadiusVaryingArg {
  return typeof arg === 'object' && arg !== null && 'values' in arg && 'scale' in arg;
}

export type RadiusUnifiedValid = RadiusUnifiedArg
export type RadiusVaryingValid = RadiusVaryingArg
export type RadiusValid = RadiusUnifiedValid | RadiusVaryingValid
