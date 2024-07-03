import {isRespValByValueUserArgsResponsive, RespValByValue, RespValByValueUserArgs} from "./responsive-value-value";
import {
  isRespValByCallbackUserArgsResponsive,
  RespValByCallback,
  RespValByCallbackUserArgs
} from "./responsive-value-callback";
import {ComponentBreakpointsScopeMapping} from "../breakpoints/component-breakpoints/component-breakpoints-scope";

export type RespValUserArgs<T> = T | RespValByValueUserArgs<T> | RespValByCallbackUserArgs<T>

export type RespValResponsive<T> = RespValByValue<T> | RespValByCallback<T>

export type RespVal<T> = T | RespValResponsive<T>

export function validateRespVal<T>(args: RespValUserArgs<T>) : RespVal<T> {
  if (isRespValByValueUserArgsResponsive(args)) return new RespValByValue(args)
  if (isRespValByCallbackUserArgsResponsive(args)) return new RespValByCallback(args)
  return args
}

export function getCurrentRespVal<T>(val: RespVal<T>, mapping: ComponentBreakpointsScopeMapping): T {
  if (!isRespValByCallbackUserArgsResponsive(val) && !isRespValByValueUserArgsResponsive(val)) return val
  const layoutIndex = val.getCurrentLayoutIndexFromCSS(mapping)
  return val.estimate(layoutIndex)
}
