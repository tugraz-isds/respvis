import {LengthDimension} from "../../constants/types";

import {BreakpointScope, ResponsiveValueOptional} from "./responsive-value";
import {ResponsiveValueByValue} from "./responsive-value-value";

export type ResponsiveValueByCallback<T> = {
  value: T,
  mapping: { [key: number]: (value: T) => any },
  dependentOn: LengthDimension,
  scope?: BreakpointScope
}
export type ResponsiveValueByCallbackOptional<T> = ResponsiveValueByCallback<T> | T

export function isResponsiveValueByCallback<T>(arg: ResponsiveValueOptional<T>): arg is ResponsiveValueByCallback<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg && 'value' in arg;
}

export function estimateResponsiveValueByCallback<T>(exactBreakpoint: number, respVal: ResponsiveValueByCallback<T>) {
  let value: ((arg: any) => T) | null = null
  for (let i = 0; i <= exactBreakpoint; i++) {
    if (respVal.mapping[i]) value = respVal.mapping[i]
  }
  if (value) value(respVal.value)
  return respVal.value
}

export function getExactResponsiveValueByCallback<T>(exactBreakpoint: number, respVal: ResponsiveValueByCallback<T>) {
  if (respVal.mapping[exactBreakpoint]) {
    respVal.mapping[exactBreakpoint](respVal.value)
  }
  return respVal.value
}
