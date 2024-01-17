import {LengthDimension, SVGHTMLElement} from "../../constants/types";
import {getBreakpointStatesFromCSS, LayoutIndices} from "./breakpoint";

type BreakpointScopeRequired = 'chart'
type BreakpointScopeOptional = 'self'
export type BreakpointScope = BreakpointScopeOptional | BreakpointScopeRequired
export type BreakpointScopeElementMapping = {
  [k in BreakpointScopeOptional]?: SVGHTMLElement
} & {
  [k in BreakpointScopeRequired]: SVGHTMLElement
}

export type ResponsiveValueByValue<T> = {
  tuples: [index: number, value: T][]
  dependentOn: LengthDimension,
  scope?: BreakpointScope
}

export type ResponsiveValueByValueOptional<T> = ResponsiveValueByValue<T> | T

export type ResponsiveValueByCallback<T> = {
  value: T,
  tuples: [index: number, callback: (value: T) => any][],
  dependentOn: LengthDimension,
  scope?: BreakpointScope
}

export type ResponsiveValueByCallbackOptional<T> = ResponsiveValueByCallback<T> | T


export function isResponsiveValueByCallback<T>(arg: ResponsiveValueOptional<T>): arg is ResponsiveValueByCallback<T> {
  return typeof arg === 'object' && arg !== null && 'tuples' in arg && 'dependentOn' in arg && 'value' in arg;
}

export type ResponsiveValue<T> = ResponsiveValueByValue<T> | ResponsiveValueByCallback<T>

export function isResponsiveValue<T>(arg: ResponsiveValueOptional<T>): arg is ResponsiveValue<T> {
  return typeof arg === 'object' && arg !== null && 'tuples' in arg && 'dependentOn' in arg;
}

export type ResponsiveValueOptional<T> = ResponsiveValue<T> | T

export function getCurrentResponsiveValue<T>(val: ResponsiveValueOptional<T>, mapping: BreakpointScopeElementMapping ): T {
  if (isResponsiveValue(val)) {
    const scope = val.scope ? val.scope : 'chart'
    const mappingElement = mapping[scope]
    const element = mappingElement ? mappingElement : mapping.chart
    const layoutIndices = getBreakpointStatesFromCSS(element)
    return getResponsiveValuesByIndices(layoutIndices, val)
  }
  return val
}

function getResponsiveValuesByIndices<T>(indices: LayoutIndices, respVal: ResponsiveValue<T>) {
  const currentIndex = indices[respVal.dependentOn]
  if (isResponsiveValueByCallback(respVal)) {
    let tuple = respVal.tuples[0]
    for (let i = 1; i < respVal.tuples.length; i++) {
      if (respVal.tuples[i][0] <= currentIndex) tuple = respVal.tuples[i]
    }
    tuple[1](respVal.value)
    return respVal.value
  }

  let tuple = respVal.tuples[0]
  for (let i = 1; i < respVal.tuples.length; i++) {
    if (respVal.tuples[i][0] <= currentIndex) tuple = respVal.tuples[i]
  }
  return tuple[1]
}
