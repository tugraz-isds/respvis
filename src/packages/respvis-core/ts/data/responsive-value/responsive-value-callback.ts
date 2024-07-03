import {LengthDimension} from "../../constants/types";
import {ComponentBreakpointsScope} from "../breakpoints/component-breakpoints/component-breakpoints-scope";

import {RespValBase} from "./responsive-value-base";

export type RespValByCallbackUserArgsResponsive<T> = {
  value: T,
  mapping: { [key: number]: (value: T) => any },
  dependentOn: LengthDimension,
  scope?: ComponentBreakpointsScope
}

export type RespValByCallbackUserArgs<T> = T | RespValByCallbackUserArgsResponsive<T>

export function isRespValByCallbackUserArgsResponsive<T>(arg: any): arg is RespValByCallbackUserArgsResponsive<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg && 'value' in arg;
}

export class RespValByCallback<T> extends RespValBase<T> {
  value: T
  mapping: { [key: number]: (value: T) => any }

  constructor(args: RespValByCallbackUserArgsResponsive<T>) {
    super(args.dependentOn, args.scope)
    this.value = args.value
    this.mapping = args.mapping
  }

  estimate(layoutIndex: number): T {
    let value: ((arg: any) => T) | null = null
    for (let i = 0; i <= layoutIndex; i++) {
      if (this.mapping[i]) value = this.mapping[i]
    }
    if (value) value(this.value)
    return this.value
  }
}
