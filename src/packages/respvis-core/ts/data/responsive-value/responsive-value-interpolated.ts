import {defaultScope, maxBreakpointCount} from "../../constants/other";
import {BreakpointScope, BreakpointScopeMapping} from "../breakpoints/breakpoint-scope";
import {CSSLengthValue, LengthDimension} from "../../constants/types";
import {getLayoutWidthIndexFromCSS} from "../layout-breakpoints";
import {cssLengthInPx, elementFromSelection} from "../../utilities";
import {ErrorMessages} from "../../constants";
import {RespValBase} from "./responsive-value-base";

type RespValInterpolatedUserArgsResponsive<T> = {
  readonly breakpointValues: { 0: T, [key: number]: T },
  readonly dependentOn: LengthDimension,
  readonly scope?: BreakpointScope
}

export type RespValInterpolatedUserArgs<T> = T | RespValInterpolatedUserArgsResponsive<T>

export function isRespValInterpolatedUserArgsResponsive<T>(arg: any): arg is RespValInterpolatedUserArgsResponsive<T> {
  return typeof arg === 'object' && arg !== null && 'breakpointValues' in arg && 'dependentOn' in arg && !('value' in arg)
}

export function validateRespValInterpolated<T>(args: RespValInterpolatedUserArgs<T>): RespValInterpolatedOptional<T> {
  if (!isRespValInterpolatedUserArgsResponsive(args)) {
    return args
  }
  return new RespValInterpolated(args)
}

export type RespValInterpolatedOptional<T> = RespValInterpolated<T> | T
export class RespValInterpolated<T> extends RespValBase<T> {
  readonly mapping: { 0: T, [key: number]: T }

  constructor(args: RespValInterpolatedUserArgsResponsive<T>) {
    super(args.dependentOn, args.scope)
    this.mapping = args.breakpointValues
  }

  getRespValInterpolated(scopes: BreakpointScopeMapping) {
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
    const lastBreakpoint = getBreakpointData(this.getLastValidLayoutIndex())!

    function getBreakpointData(index: number | null) {
      if (index === null) return null
      const defaultMaxLength = breakpointsTransformed.values[breakpointsTransformed.values.length - 1] + breakpointsTransformed.unit
      return { index,
        value: respVal.mapping[index],
        length: cssLengthInPx(breakpointsTransformed.getLengthAt(index, '0px', defaultMaxLength) as CSSLengthValue, element)
      }
    }

    return { preBreakpoint, postBreakpoint, firstBreakpoint, lastBreakpoint }
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
