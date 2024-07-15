import {ErrorMessages} from "../../constants/error";
import {maxBreakpointCount} from "../../constants/other";
import {
  ComponentBreakpointsScope,
  ComponentBreakpointsScopeMapping
} from "../breakpoints/component-breakpoints/component-breakpoints-scope";
import {LengthDimension} from "../../constants/types";
import {ResponsivePropertyBase} from "./responsive-property-base";

type ResponsiveValueUserArgsResponsive<T> = {
  readonly mapping: { 0: T, [key: number]: T },
  readonly dependentOn: LengthDimension,
  readonly scope?: ComponentBreakpointsScope
}

export type ResponsiveValueUserArgs<T> = T | ResponsiveValueUserArgsResponsive<T>

export function isResponsiveValueUserArgsResponsive<T>(arg: any): arg is ResponsiveValueUserArgsResponsive<T> {
  return typeof arg === 'object' && arg !== null && 'mapping' in arg && 'dependentOn' in arg && !('value' in arg)
}

export function validateResponsiveValue<T>(args: ResponsiveValueUserArgs<T>) {
  if (!isResponsiveValueUserArgsResponsive(args)) {
    return args
  }
  return new ResponsiveValue(args)
}

export type ResponsiveValueOptional<T> = ResponsiveValue<T> | T
export class ResponsiveValue<T> extends ResponsivePropertyBase<T> {
  readonly mapping: { 0: T, [key: number]: T }

  constructor(args: ResponsiveValueUserArgsResponsive<T>) {
    super(args.dependentOn, args.scope)
    this.mapping = args.mapping
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

export function getCurrentResponsiveValue<T>(val: ResponsiveValueOptional<T>, mapping: ComponentBreakpointsScopeMapping): T {
  if (!isResponsiveValueUserArgsResponsive(val)) return val
  const layoutIndex = val.getCurrentLayoutIndexFromCSS(mapping)
  return val.estimate(layoutIndex)
}
