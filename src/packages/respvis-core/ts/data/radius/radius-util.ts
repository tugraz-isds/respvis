import {Radius} from "./radius";
import {getCurrentRespVal} from "../responsive-value/responsive-value";
import {BreakpointScopeMapping} from "../breakpoints/breakpoint-scope";
import {ScaledValuesLinear} from "../scale/scaled-values-linear";
import {noParentKey} from "../../constants/other";
import {isBubbleRadiusUserArgs} from "./bubble-radius";

export function getRadiusScaledValues(radius: Radius, mapping: BreakpointScopeMapping) {
  if (isBubbleRadiusUserArgs(radius)) {
    const scale = getCurrentRespVal(radius.scale, mapping)
    return new ScaledValuesLinear({values: radius.values, scale, parentKey: noParentKey})
  }
  return getCurrentRespVal(radius, mapping)
}
