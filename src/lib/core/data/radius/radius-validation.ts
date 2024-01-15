import {ResponsiveValueByCallback, ResponsiveValueByValue} from "../breakpoint/responsive-value";
import {ScaleAny} from "../../utilities/scale";

export type RadiusUnifiedArg = ResponsiveValueByValue<number>
export type RadiusVaryingArg = {
  values: number[]
  scale: ResponsiveValueByCallback<ScaleAny<any, number, number>>
}
export type RadiusArg = RadiusUnifiedArg | RadiusVaryingArg

export function isRadiusVaryingArg(arg: any): arg is RadiusVaryingArg {
  return typeof arg === 'object' && arg !== null && 'values' in arg && 'scale' in arg;
}

export type RadiusUnifiedValid = RadiusUnifiedArg
export type RadiusVaryingValid = RadiusVaryingArg
export type RadiusValid = RadiusUnifiedValid | RadiusVaryingValid
