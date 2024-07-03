import {
  BreakpointProperty,
  BreakpointPropertyUserArgs,
  isBreakpointPropertyUserArgsResponsive,
  validateBreakpointProperty
} from "../responsive-property/breakpoint-property";

export type InterpolatedRadiusUserArgs = BreakpointPropertyUserArgs<number>
export type InterpolatedRadius = BreakpointProperty<number> | number

export function isInterpolatedRadiusUserArgs(args: any): args is InterpolatedRadiusUserArgs {
  return typeof args === 'number' || isBreakpointPropertyUserArgsResponsive(args)
}

export function validateInterpolatedRadius(args?: InterpolatedRadiusUserArgs): InterpolatedRadius {
  return validateBreakpointProperty(args || 5)
}
