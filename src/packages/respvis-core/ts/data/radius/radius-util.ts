import {Radius} from "./radius";
import {isBubbleRadiusUserArgs} from "./bubble-radius";
import {getCurrentRespVal} from "../responsive-value";
import {ComponentBreakpointsScopeMapping} from "../breakpoints";
import {ScaledValuesNumeric} from "../scale";
import {noParentKey} from "../../constants/other";

export function getRadiusScaledValues(radius: Radius, mapping: ComponentBreakpointsScopeMapping) {
  if (isBubbleRadiusUserArgs(radius)) {
    const scale = getCurrentRespVal(radius.scale, mapping)
    return new ScaledValuesNumeric({values: radius.values, scale, parentKey: noParentKey})
  }
  return getCurrentRespVal(radius, mapping)
}
