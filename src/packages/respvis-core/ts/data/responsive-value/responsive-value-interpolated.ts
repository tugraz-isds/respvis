import {defaultScope, maxBreakpointCount} from "../../constants/other";
import {BreakpointScope, BreakpointScopeMapping} from "../breakpoints/breakpoint-scope";
import {CSSLengthValue, LengthDimension} from "../../constants/types";
import {getLayoutWidthIndexFromCSS} from "../breakpoints";
import {cssLengthInPx, elementFromSelection, ErrorMessages, RespValBase} from "respvis-core";

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
    const chartElement = elementFromSelection(layoutBreakpointsS)

    const layout = this.dependentOn
    const layoutWidthIndex = getLayoutWidthIndexFromCSS(elementFromSelection(layoutBreakpointsS), layout)

    const preBreakpointIndex = this.getFirstValidPreLayoutIndex(layoutWidthIndex + 1)
    const preBreakpointValue = preBreakpointIndex !== null ? this.mapping[preBreakpointIndex] : null

    const postBreakpointIndex = this.getFirstValidPostLayoutIndex(layoutWidthIndex)
    const postBreakpointValue = postBreakpointIndex !== null ? this.mapping[postBreakpointIndex] : null

    const breakpointsTransformed = this.getBreakpoints(scopes).getTransformed(chartElement)
    const [preBreakPointLength, postBreakPointLength] = breakpointsTransformed
      .getSurroundingLengths(layoutWidthIndex).map(length => cssLengthInPx(length as CSSLengthValue, chartElement))

    return { preBreakpointIndex, preBreakpointValue, preBreakPointLength,
      postBreakpointIndex, postBreakpointValue, postBreakPointLength }
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
