import {ScaleLinear} from "d3";

import {RespValByCallback} from "../responsive-value/responsive-value-callback";
import {RespValByValueOptional} from "../responsive-value/responsive-value-value";

export type RadiusUnifiedArg = RespValByValueOptional<number>
export type RadiusVaryingArg = {
  values: number[]
  scale: RespValByCallback<ScaleLinear<number, number>>
}
export type RadiusArg = RadiusUnifiedArg | RadiusVaryingArg

export function isRadiusVaryingArg(arg: any): arg is RadiusVaryingArg {
  return typeof arg === 'object' && arg !== null && 'values' in arg && 'scale' in arg;
}

export type RadiusUnified = RadiusUnifiedArg
export type RadiusVarying = RadiusVaryingArg
export type Radius = RadiusUnified | RadiusVarying
