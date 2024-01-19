import {LengthDimension} from "../../constants/types";

import {getPostLayoutIndex, getPreLayoutIndex, ResponsiveValueOptional} from "./responsive-value";
import {ErrorMessages} from "../../utilities/error";
import {defaultScope, maxBreakpointCount} from "../../constants/other";
import {BreakpointScope, BreakpointScopeMapping} from "../breakpoint/breakpoint-scope";
import {getLayoutStateFromCSS} from "../breakpoint/breakpoint";

export type RespValByValue<T> = {
  mapping: { 0: T, [key: number]: T },
  dependentOn: LengthDimension,
  scope?: BreakpointScope
}
export type RespValByValueOptional<T> = RespValByValue<T> | T

export function isResponsiveValueByValue<T>(arg: ResponsiveValueOptional<T>): arg is RespValByValue<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg && !('value' in arg)
}

export type ResponsiveValueInformation = ReturnType<typeof getResponsiveValueInformation>
export function getResponsiveValueInformation<T>(respVal: RespValByValue<T>, scopes: BreakpointScopeMapping) {
  const desiredElement = respVal.scope ? scopes[respVal.scope] : undefined
  const element = desiredElement ? desiredElement : scopes[defaultScope]
  const layout = respVal.dependentOn
  // console.log(desiredElement)

  const {index: layoutIndex} = getLayoutStateFromCSS(element, layout)
  const valueAtLayoutIndex = getExactResponsiveValueByValue(layoutIndex, respVal)

  const preLayoutIndex = getPreLayoutIndex(layoutIndex, respVal)
  const valueAtPreLayoutIndex = preLayoutIndex !== null ? getExactResponsiveValueByValue(preLayoutIndex, respVal) : null

  const postLayoutIndex = getPostLayoutIndex(layoutIndex, respVal)
  const valueAtPostLayoutIndex = postLayoutIndex !== null ? getExactResponsiveValueByValue(postLayoutIndex, respVal) : null

  //TODO: Test with different configurations
  // if (element.classList.contains('axis-x')) {
  //   console.log(element, layout, layoutIndex, valueAtLayoutIndex,
  //     preLayoutIndex, valueAtPreLayoutIndex, postLayoutIndex, valueAtPostLayoutIndex)
  // }

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
  if (respVal.mapping[exactBreakpoint]) return respVal.mapping[exactBreakpoint]
  return null
}
