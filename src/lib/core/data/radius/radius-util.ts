import {BoundScopeElementMapping, getConfigBoundableState} from "../resizing/boundable";
import {isRadiusVaryingArg, RadiusValid} from "./radius-validation";

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
