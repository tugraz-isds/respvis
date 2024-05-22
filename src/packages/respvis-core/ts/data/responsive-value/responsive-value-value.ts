import {ErrorMessages} from "../../utilities/error";
import {defaultScope, maxBreakpointCount} from "../../constants/other";
import {BreakpointScope, BreakpointScopeMapping} from "../breakpoints/breakpoint-scope";
import {LengthDimension} from "../../constants/types";
import {getLayoutWidth} from "../breakpoints";

//TODO: Simultaneous Interpretation of multiple breakpoint indexes
// Change dependentOn to be inside mapping
// Properties of mapping can then be mapping themselves
// Or instead of mapping as key, use width / height as keys

export type RespValByValue<T> = {
  readonly mapping: { 0: T, [key: number]: T },
  readonly dependentOn: LengthDimension,
  readonly scope?: BreakpointScope
}
export type RespValByValueOptional<T> = RespValByValue<T> | T

export function isResponsiveValueByValue<T>(arg: any): arg is RespValByValue<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg && !('value' in arg)
}

export function getResponsiveValueInformation<T>(respVal: RespValByValue<T>, scopes: BreakpointScopeMapping) {
  const desiredElement = respVal.scope ? scopes[respVal.scope] : undefined
  const element = desiredElement ? desiredElement : scopes[defaultScope]
  const layout = respVal.dependentOn

  const {index: layoutIndex} = getLayoutWidth(element, layout)
  const valueAtLayoutIndex = getExactResponsiveValueByValue(layoutIndex, respVal)

  const preLayoutIndex = getPreLayoutIndex(layoutIndex, respVal)
  const valueAtPreLayoutIndex = preLayoutIndex !== null ? getExactResponsiveValueByValue(preLayoutIndex, respVal) : null

  const postLayoutIndex = getPostLayoutIndex(layoutIndex, respVal)
  const valueAtPostLayoutIndex = postLayoutIndex !== null ? getExactResponsiveValueByValue(postLayoutIndex, respVal) : null

  return { element, layout, layoutIndex, valueAtLayoutIndex,
    preLayoutIndex, valueAtPreLayoutIndex, postLayoutIndex, valueAtPostLayoutIndex }
}

export function estimateResponsiveValueByValue<T>(exactBreakpoint: number, respVal: RespValByValue<T>) {
  let value: T | undefined = undefined
  for (let i = 0; i < maxBreakpointCount; i++) {
    if (respVal.mapping[i] !== undefined) value = respVal.mapping[i]
    if (value !== undefined && i >= exactBreakpoint) break
  }
  if (value === undefined) throw new Error(ErrorMessages.responsiveValueHasNoValues)
  return value
}

export function getExactResponsiveValueByValue<T>(exactBreakpoint: number, respVal: RespValByValue<T>) {
  return respVal.mapping[exactBreakpoint] ?? null
}

export function getPreLayoutIndex<T>(exactBreakpoint: number, respVal: RespValByValue<T>) {
  for (let i = exactBreakpoint - 1; i >= 0; i--) {
    if (respVal.mapping[i] !== undefined) return i
  }
  return null
}

export function getPostLayoutIndex<T>(exactBreakpoint: number, respVal: RespValByValue<T>) {
  const keys = Object.keys(respVal.mapping)
  for (let i = 0; i < keys.length; i++) {
    const index = parseInt(keys[i])
    if (index > exactBreakpoint) return index
  }
  return null
}
