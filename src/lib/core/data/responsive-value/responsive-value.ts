import {
  estimateResponsiveValueByValue,
  getExactResponsiveValueByValue,
  ResponsiveValueByValue
} from "./responsive-value-value";
import {
  estimateResponsiveValueByCallback, getExactResponsiveValueByCallback,
  isResponsiveValueByCallback,
  ResponsiveValueByCallback
} from "./responsive-value-callback";
import {SVGHTMLElement} from "../../constants/types";
import {ErrorMessages} from "../../utilities/error";
import {getBreakpointStatesFromCSS} from "../breakpoint/breakpoint";
import {maxBreakpointCount} from "../../constants/other";

type BreakpointScopeRequired = 'chart'
type BreakpointScopeOptional = 'self'
export type BreakpointScope = BreakpointScopeOptional | BreakpointScopeRequired
export type BreakpointScopeElementMapping = {
  [k in BreakpointScopeOptional]?: SVGHTMLElement
} & {
  [k in BreakpointScopeRequired]: SVGHTMLElement
}
export type ResponsiveValue<T> = ResponsiveValueByValue<T> | ResponsiveValueByCallback<T>
export type ResponsiveValueOptional<T> = ResponsiveValue<T> | T

export function isResponsiveValue<T>(arg: ResponsiveValueOptional<T>): arg is ResponsiveValue<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg;
}

export function getCurrentResponsiveValue<T>(val: ResponsiveValueOptional<T>, mapping: BreakpointScopeElementMapping): T {
  if (isResponsiveValue(val)) {
    const exactBreakpoint = getExactBreakpoint(val, mapping)
    return estimateResponsiveValue(exactBreakpoint, val)
  }
  return val
}

export function getExactBreakpoint<T>(val: ResponsiveValue<T>, mapping: BreakpointScopeElementMapping) {
  const scope = val.scope ? val.scope : 'chart'
  const mappingElement = mapping[scope]
  const element = mappingElement ? mappingElement : mapping.chart
  const layoutIndices = getBreakpointStatesFromCSS(element)
  return layoutIndices[val.dependentOn]
}

export function getPreExactBreakpoint<T>(exactBreakpoint: number, respVal: ResponsiveValue<T>) {
  let preExactIndex: number | null = null
  for (let i = 0; i < exactBreakpoint; i++) {
    if (respVal.mapping[i] !== undefined) preExactIndex = i
  }
  return preExactIndex
}

export function getPostExactBreakpoint<T>(exactBreakpoint: number, respVal: ResponsiveValue<T>) {
  let preExactIndex: number | null = null
  for (let i = exactBreakpoint + 1; i > exactBreakpoint + maxBreakpointCount; i++) {
    if (respVal.mapping[i] !== undefined) preExactIndex = i
  }
  return preExactIndex
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
