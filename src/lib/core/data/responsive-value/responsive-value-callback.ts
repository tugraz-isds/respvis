import {LengthDimension} from "../../constants/types";

import {RespValOptional} from "./responsive-value";
import {BreakpointScope} from "../breakpoint/breakpoint-scope";

export type RespValByCallback<T> = {
  value: T,
  mapping: { [key: number]: (value: T) => any },
  dependentOn: LengthDimension,
  scope?: BreakpointScope
}
export type RespValByCallbackOptional<T> = RespValByCallback<T> | T

export function isRespValByCallback<T>(arg: RespValOptional<T>): arg is RespValByCallback<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg && 'value' in arg;
}

export function estimateRespValByCallback<T>(exactBreakpoint: number, respVal: RespValByCallback<T>) {
  let value: ((arg: any) => T) | null = null
  for (let i = 0; i <= exactBreakpoint; i++) {
    if (respVal.mapping[i]) value = respVal.mapping[i]
  }
  if (value) value(respVal.value)
  return respVal.value
}

export function getExactRespValByCallback<T>(exactBreakpoint: number, respVal: RespValByCallback<T>) {
  if (respVal.mapping[exactBreakpoint]) {
    respVal.mapping[exactBreakpoint](respVal.value)
  }
  return respVal.value
}
