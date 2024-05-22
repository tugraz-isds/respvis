import {isRadiusVaryingArg, Radius} from "./radius";
import {getCurrentRespVal} from "../responsive-value/responsive-value";
import {BreakpointScopeMapping} from "../breakpoints/breakpoint-scope";
import {ScaledValuesLinear} from "../scale/scaled-values-linear";
import {noParentKey} from "../../constants/other";

export function getRadiusScaledValues(radius: Radius, mapping: BreakpointScopeMapping) {
  if (isRadiusVaryingArg(radius)) {
    const scale = getCurrentRespVal(radius.scale, mapping)
    return new ScaledValuesLinear({values: radius.values, scale, parentKey: noParentKey})
  }
  return getCurrentRespVal(radius, mapping)
}
