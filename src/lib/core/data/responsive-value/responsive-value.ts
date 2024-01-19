import {
  estimateResponsiveValueByValue,
  getExactResponsiveValueByValue,
  RespValByValue
} from "./responsive-value-value";
import {
  estimateResponsiveValueByCallback,
  getExactResponsiveValueByCallback,
  isResponsiveValueByCallback,
  ResponsiveValueByCallback
} from "./responsive-value-callback";
import {getLayoutStatesFromCSS} from "../breakpoint/breakpoint";
import {maxBreakpointCount} from "../../constants/other";
import {BreakpointScopeMapping} from "../breakpoint/breakpoint-scope";

export type ResponsiveValue<T> = RespValByValue<T> | ResponsiveValueByCallback<T>
export type ResponsiveValueOptional<T> = ResponsiveValue<T> | T

export function isResponsiveValue<T>(arg: ResponsiveValueOptional<T>): arg is ResponsiveValue<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg;
}

export function getCurrentResponsiveValue<T>(val: ResponsiveValueOptional<T>, mapping: BreakpointScopeMapping): T {
  if (isResponsiveValue(val)) {
    const exactBreakpoint = getExactLayoutIndex(val, mapping)
    return estimateResponsiveValue(exactBreakpoint, val)
  }
  return val
}

export function getExactLayoutIndex<T>(val: ResponsiveValue<T>, mapping: BreakpointScopeMapping) {
  const scope = val.scope ? val.scope : 'chart'
  const mappingElement = mapping[scope]
  const element = mappingElement ? mappingElement : mapping.chart
  const layoutIndices = getLayoutStatesFromCSS(element)
  return layoutIndices[val.dependentOn]
}

export function getPreLayoutIndex<T>(exactBreakpoint: number, respVal: ResponsiveValue<T>) {
  for (let i = exactBreakpoint - 1; i >= 0; i--) {
    if (respVal.mapping[i] !== undefined) return i
  }
  return null
}

export function getPostLayoutIndex<T>(exactBreakpoint: number, respVal: ResponsiveValue<T>) {
  const keys = Object.keys(respVal.mapping)
  for (let i = 0; i < keys.length; i++) {
    const index = parseInt(keys[i])
    if (index > exactBreakpoint) return index
  }
  return null
}

function estimateResponsiveValue<T>(exactBreakpoint: number, respVal: ResponsiveValue<T>) {
  if (isResponsiveValueByCallback(respVal)) {
    return estimateResponsiveValueByCallback(exactBreakpoint, respVal)
  }
  return estimateResponsiveValueByValue(exactBreakpoint, respVal)
}

function getExactResponsiveValue<T>(exactBreakpoint: number, respVal: ResponsiveValue<T>) {
  if (isResponsiveValueByCallback(respVal)) {
    return getExactResponsiveValueByCallback(exactBreakpoint, respVal)
  }
  return getExactResponsiveValueByValue(exactBreakpoint, respVal)
}
