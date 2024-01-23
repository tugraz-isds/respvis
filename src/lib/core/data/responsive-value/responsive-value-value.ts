import {LengthDimension} from "../../constants/types";

import {getPostLayoutIndex, getPreLayoutIndex, RespValOptional} from "./responsive-value";
import {ErrorMessages} from "../../utilities/error";
import {defaultScope, maxBreakpointCount} from "../../constants/other";
import {BreakpointScope, BreakpointScopeMapping} from "../breakpoint/breakpoint-scope";
import {getLayoutStateFromCSS} from "../breakpoint/breakpoint";

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

export function respValByValueValidation() {

}

export function isResponsiveValueByValue<T>(arg: RespValOptional<T>): arg is RespValByValue<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg && !('value' in arg)
}

export type ResponsiveValueInformation = ReturnType<typeof getResponsiveValueInformation>
export function getResponsiveValueInformation<T>(respVal: RespValByValue<T>, scopes: BreakpointScopeMapping) {
  const desiredElement = respVal.scope ? scopes[respVal.scope] : undefined
  const element = desiredElement ? desiredElement : scopes[defaultScope]
  const layout = respVal.dependentOn

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
  return respVal.mapping[exactBreakpoint] ?? null
}
