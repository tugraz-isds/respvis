import {ScaleAny} from "../scale";
import {
  BoundScopeElementMapping,
  ConfigTupleBoundableCallback,
  ConfigTupleBoundableValue,
  getConfigBoundableState
} from "../resizing/boundable";

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

export function getMaxRadius(radius: RadiusValid, mapping: BoundScopeElementMapping) {
  const radiusOrScale = getRadiusDefinite(radius, mapping)
  return typeof radiusOrScale === 'number' ? radiusOrScale : radiusOrScale.scale.range()[1]
}

export function getRadiusDefinite(radius: RadiusValid, mapping: BoundScopeElementMapping) {
  if (isRadiusVaryingArg(radius)) {
    const scale = getConfigBoundableState(radius.scale, mapping)
    return {...radius, scale}
  }
  return getConfigBoundableState(radius, mapping)
}
