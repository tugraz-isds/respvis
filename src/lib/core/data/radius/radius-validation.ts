import {ConfigTupleBoundableCallback, ConfigTupleBoundableValue} from "../resizing/boundable";
import {ScaleAny} from "../../utilities/scale";

export type RadiusUnifiedArg = ConfigTupleBoundableValue<number>
export type RadiusVaryingArg = {
  values: number[]
  scale: ConfigTupleBoundableCallback<ScaleAny<any, number, number>>
}
export type RadiusArg = RadiusUnifiedArg | RadiusVaryingArg

export function isRadiusVaryingArg(arg: any): arg is RadiusVaryingArg {
  return typeof arg === 'object' && arg !== null && 'values' in arg && 'scale' in arg;
}

export type RadiusUnifiedValid = RadiusUnifiedArg
export type RadiusVaryingValid = RadiusVaryingArg
export type RadiusValid = RadiusUnifiedValid | RadiusVaryingValid
