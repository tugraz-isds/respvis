import {Radius} from "./radius";
import {isBubbleRadiusUserArgs} from "./bubble-radius";
import {getCurrentResponsiveValue} from "../responsive-property";
import {ComponentBreakpointsScopeMapping} from "../breakpoints";
import {ScaledValuesNumeric} from "../scale";
import {noParentKey} from "../../constants/other";

export function getRadiusScaledValues(radius: Radius, mapping: ComponentBreakpointsScopeMapping) {
  if (isBubbleRadiusUserArgs(radius)) {
    const scale = getCurrentResponsiveValue(radius.scale, mapping)
    return new ScaledValuesNumeric({values: radius.values, scale, parentKey: noParentKey})
  }
  return getCurrentResponsiveValue(radius, mapping)
}
