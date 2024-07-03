import {ErrorMessages} from "../../constants/error";
import {maxBreakpointCount} from "../../constants/other";
import {
  ComponentBreakpointsScope,
  ComponentBreakpointsScopeMapping
} from "../breakpoints/component-breakpoints/component-breakpoints-scope";
import {LengthDimension} from "../../constants/types";
import {elementFromSelection} from "../../utilities";
import {RespValBase} from "./responsive-value-base";

type RespValByValueUserArgsResponsive<T> = {
  readonly mapping: { 0: T, [key: number]: T },
  readonly dependentOn: LengthDimension,
  readonly scope?: ComponentBreakpointsScope
}

export type RespValByValueUserArgs<T> = T | RespValByValueUserArgsResponsive<T>

export function isRespValByValueUserArgsResponsive<T>(arg: any): arg is RespValByValueUserArgsResponsive<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg && !('value' in arg)
}

export function validateResponsiveValByValue<T>(args: RespValByValueUserArgs<T>) {
  if (!isRespValByValueUserArgsResponsive(args)) {
    return args
  }
  return new RespValByValue(args)
}

export type RespValByValueOptional<T> = RespValByValue<T> | T
export class RespValByValue<T> extends RespValBase<T> {
  readonly mapping: { 0: T, [key: number]: T }

  constructor(args: RespValByValueUserArgsResponsive<T>) {
    super(args.dependentOn, args.scope)
    this.mapping = args.mapping
  }

  getResponsiveValueInformation(scopeMapping: ComponentBreakpointsScopeMapping) {
    const element = elementFromSelection(this.getLayoutSelection(scopeMapping))
    const breakpoints = this.getBreakpoints(scopeMapping)

    const layoutWidthIndex = breakpoints.getCurrentLayoutWidthIndexFromCSS(element)
    const valueAtLayoutIndex = this.mapping[layoutWidthIndex] ?? null

    const preLayoutIndex = this.getFirstValidPreLayoutIndex(layoutWidthIndex)
    const valueAtPreLayoutIndex = preLayoutIndex !== null ? this.mapping[preLayoutIndex] : null

    const postLayoutIndex = this.getFirstValidPostLayoutIndex(layoutWidthIndex)
    const valueAtPostLayoutIndex = postLayoutIndex !== null ? this.mapping[postLayoutIndex] : null

    return { element, layout: this.dependentOn, layoutIndex: layoutWidthIndex, valueAtLayoutIndex,
      preLayoutIndex, valueAtPreLayoutIndex, postLayoutIndex, valueAtPostLayoutIndex }
  }

  estimate(layoutIndex: number): T {
    let value: T | undefined = undefined
    for (let i = 0; i < maxBreakpointCount; i++) {
      if (this.mapping[i] !== undefined) value = this.mapping[i]
      if (value !== undefined && i >= layoutIndex) break
    }
    if (value === undefined) throw new Error(ErrorMessages.responsiveValueHasNoValues)
    return value
  }

}
