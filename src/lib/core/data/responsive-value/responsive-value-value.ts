import {LengthDimension} from "../../constants/types";

import {BreakpointScope, ResponsiveValue, ResponsiveValueOptional} from "./responsive-value";
import {isResponsiveValueByCallback} from "./responsive-value-callback";
import {ErrorMessages} from "../../utilities/error";
import {maxBreakpointCount} from "../../constants/other";

export type ResponsiveValueByValue<T> = {
  mapping: { [key: number]: T },
  dependentOn: LengthDimension,
  scope?: BreakpointScope
}
export type ResponsiveValueByValueOptional<T> = ResponsiveValueByValue<T> | T

export function isResponsiveValueByValue<T>(arg: ResponsiveValueOptional<T>): arg is ResponsiveValueByValue<T> {
  return typeof arg === 'object' && arg !== null && 'tuples' in arg && 'dependentOn' in arg && !('value' in arg)
}

export function estimateResponsiveValueByValue<T>(exactBreakpoint: number, respVal: ResponsiveValueByValue<T>) {
  let value: T | undefined = undefined
  for (let i = 0; i < maxBreakpointCount; i++) {
    if (respVal.mapping[i] !== undefined) value = respVal.mapping[i]
    if (value !== undefined && i >= exactBreakpoint) break
  }
  if (value === undefined) throw new Error(ErrorMessages.responsiveValueHasNoValues)
  return value
}

export function getExactResponsiveValueByValue<T>(exactBreakpoint: number, respVal: ResponsiveValueByValue<T>) {
  if (respVal.mapping[exactBreakpoint]) return respVal.mapping[exactBreakpoint]
  return null
}
