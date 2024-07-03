import {defaultScope, maxBreakpointCount} from "../../constants/other";
import {
  ComponentBreakpointsScope,
  ComponentBreakpointsScopeMapping
} from "../breakpoints/component-breakpoints/component-breakpoints-scope";
import {CSSLengthValue, LengthDimension} from "../../constants/types";
import {getLayoutWidthIndexFromCSS} from "../breakpoints/component-breakpoints";
import {cssLengthInPx, elementFromSelection} from "../../utilities";
import {ErrorMessages} from "../../constants";
import {ResponsivePropertyBase} from "./responsive-property-base";

type BreakpointPropertyUserArgsResponsive<T> = {
  readonly breakpointValues: { 0: T, [key: number]: T },
  readonly dependentOn: LengthDimension,
  readonly scope?: ComponentBreakpointsScope
}

export type BreakpointPropertyUserArgs<T> = T | BreakpointPropertyUserArgsResponsive<T>

export function isBreakpointPropertyUserArgsResponsive<T>(arg: any): arg is BreakpointPropertyUserArgsResponsive<T> {
  return typeof arg === 'object' && arg !== null && 'breakpointValues' in arg && 'dependentOn' in arg && !('value' in arg)
}

export function validateBreakpointProperty<T>(args: BreakpointPropertyUserArgs<T>): BreakpointPropertyOptional<T> {
  if (!isBreakpointPropertyUserArgsResponsive(args)) {
    return args
  }
  return new BreakpointProperty(args)
}

export type BreakpointPropertyOptional<T> = BreakpointProperty<T> | T
export class BreakpointProperty<T> extends ResponsivePropertyBase<T> {
  readonly mapping: { 0: T, [key: number]: T }

  constructor(args: BreakpointPropertyUserArgsResponsive<T>) {
    super(args.dependentOn, args.scope)
    this.mapping = args.breakpointValues
  }

  getRespValInterpolated(scopes: ComponentBreakpointsScopeMapping) {
    const desiredElement = this.scope ? scopes[this.scope] : undefined
    const layoutBreakpointsS = desiredElement ? desiredElement : scopes[defaultScope]
    const element = elementFromSelection(layoutBreakpointsS)
    const breakpointsTransformed = this.getBreakpoints(scopes).getTransformed(element)
    const respVal = this

    const layout = this.dependentOn
    const layoutWidthIndex = getLayoutWidthIndexFromCSS(elementFromSelection(layoutBreakpointsS), layout)

    const preBreakpointIndex = this.getFirstValidPreLayoutIndex(layoutWidthIndex)
    const preBreakpoint = getBreakpointData(preBreakpointIndex)

    const postBreakpointIndex = this.getFirstValidPostLayoutIndex(preBreakpointIndex !== null ? preBreakpointIndex : -1)
    const postBreakpoint = getBreakpointData(postBreakpointIndex)

    const firstBreakpoint = getBreakpointData(this.getFirstValidLayoutIndex())!
    const lastBreakpoint = getBreakpointData(this.getLastValidLayoutIndex(breakpointsTransformed.values.length))!

    function getBreakpointData(index: number | null) {
      if (index === null || index >= breakpointsTransformed.values.length || index < 0) return null
      const defaultMaxLength = breakpointsTransformed.values[breakpointsTransformed.values.length - 1] + breakpointsTransformed.unit
      return { index,
        value: respVal.mapping[index],
        length: cssLengthInPx(breakpointsTransformed.getLengthAt(index, '0px', defaultMaxLength) as CSSLengthValue, element)
      }
    }

    return { preBreakpoint, postBreakpoint, firstBreakpoint, lastBreakpoint, element }
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
