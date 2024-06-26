import {LengthDimension} from "../../constants/types";
import {BreakpointScope} from "../breakpoints/breakpoint-scope";

export type RespValByCallback<T> = {
  value: T,
  mapping: { [key: number]: (value: T) => any },
  dependentOn: LengthDimension,
  scope?: BreakpointScope
}

export function isRespValByCallback<T>(arg: any): arg is RespValByCallback<T> {
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
