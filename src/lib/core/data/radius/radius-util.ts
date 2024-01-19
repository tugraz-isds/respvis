import {isRadiusVaryingArg, RadiusValid} from "./radius-validation";
import {getCurrentResponsiveValue} from "../responsive-value/responsive-value";
import {BreakpointScopeMapping} from "../breakpoint/breakpoint-scope";

export function getMaxRadius(radius: RadiusValid, mapping: BreakpointScopeMapping) {
  const radiusOrScale = getRadiusDefinite(radius, mapping)
  return typeof radiusOrScale === 'number' ? radiusOrScale : radiusOrScale.scale.range()[1]
}

export function getRadiusDefinite(radius: RadiusValid, mapping: BreakpointScopeMapping) {
  if (isRadiusVaryingArg(radius)) {
    const scale = getCurrentResponsiveValue(radius.scale, mapping)
    return {...radius, scale}
  }
  return getCurrentResponsiveValue(radius, mapping)
}
