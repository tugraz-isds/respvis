import {Radius} from "./radius";
import {getCurrentRespVal} from "../responsive-value/responsive-value";
import {BreakpointScopeMapping} from "../breakpoints/breakpoint-scope";
import {ScaledValuesNumeric} from "../scale/scaled-values-spatial/scaled-values-numeric";
import {noParentKey} from "../../constants/other";
import {isBubbleRadiusUserArgs} from "./bubble-radius";

export function getRadiusScaledValues(radius: Radius, mapping: BreakpointScopeMapping) {
  if (isBubbleRadiusUserArgs(radius)) {
    const scale = getCurrentRespVal(radius.scale, mapping)
    return new ScaledValuesNumeric({values: radius.values, scale, parentKey: noParentKey})
  }
  return getCurrentRespVal(radius, mapping)
}
