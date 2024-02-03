import {isRadiusVaryingArg, RadiusValid} from "./radius-validation";
import {getCurrentRespVal} from "../responsive-value/responsive-value";
import {BreakpointScopeMapping} from "../breakpoint/breakpoint-scope";
import {ScaledValuesLinear} from "../scale/scaled-values-linear";

export function getMaxRadius(radius: RadiusValid, mapping: BreakpointScopeMapping) {
  const radiusOrScale = getRadiusScaledValues(radius, mapping)
  return typeof radiusOrScale === 'number' ? radiusOrScale : radiusOrScale.scale.range()[1]
}

export function getRadiusScaledValues(radius: RadiusValid, mapping: BreakpointScopeMapping) {
  if (isRadiusVaryingArg(radius)) {
    const scale = getCurrentRespVal(radius.scale, mapping)
    return new ScaledValuesLinear({values: radius.values, scale})
  }
  return getCurrentRespVal(radius, mapping)
}
