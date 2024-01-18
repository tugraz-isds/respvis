import {isRadiusVaryingArg, RadiusValid} from "./radius-validation";
import {BreakpointScopeElementMapping, getCurrentResponsiveValue} from "../responsive-value/responsive-value";

export function getMaxRadius(radius: RadiusValid, mapping: BreakpointScopeElementMapping) {
  const radiusOrScale = getRadiusDefinite(radius, mapping)
  return typeof radiusOrScale === 'number' ? radiusOrScale : radiusOrScale.scale.range()[1]
}

export function getRadiusDefinite(radius: RadiusValid, mapping: BreakpointScopeElementMapping) {
  if (isRadiusVaryingArg(radius)) {
    const scale = getCurrentResponsiveValue(radius.scale, mapping)
    return {...radius, scale}
  }
  return getCurrentResponsiveValue(radius, mapping)
}
