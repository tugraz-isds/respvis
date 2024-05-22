import {estimateResponsiveValueByValue, RespValByValue} from "./responsive-value-value";
import {estimateRespValByCallback, isRespValByCallback, RespValByCallback} from "./responsive-value-callback";
import {BreakpointScopeMapping} from "../breakpoints/breakpoint-scope";
import {getLayoutWidths} from "../breakpoints";

export type RespVal<T> = RespValByValue<T> | RespValByCallback<T>
export type RespValOptional<T> = RespVal<T> | T

export function isRespVal<T>(arg: RespValOptional<T>): arg is RespVal<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg;
}

export function getCurrentRespVal<T>(val: RespValOptional<T>, mapping: BreakpointScopeMapping): T {
  if (isRespVal(val)) {
    const exactBreakpoint = getExactLayoutIndex(val, mapping)
    return estimateRespVal(exactBreakpoint.index, val)
  }
  return val
}

export function getExactLayoutIndex<T>(val: RespVal<T>, mapping: BreakpointScopeMapping) {
  const scope = val.scope ? val.scope : 'chart'
  const mappingElement = mapping[scope]
  const element = mappingElement ? mappingElement : mapping.chart
  const layoutIndices = getLayoutWidths(element)
  return layoutIndices[val.dependentOn]
}

function estimateRespVal<T>(exactBreakpoint: number, respVal: RespVal<T>) {
  if (isRespValByCallback(respVal)) {
    return estimateRespValByCallback(exactBreakpoint, respVal)
  }
  return estimateResponsiveValueByValue(exactBreakpoint, respVal)
}
