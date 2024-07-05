import {
  BreakpointProperty,
  BreakpointPropertyUserArgs,
  isBreakpointPropertyUserArgsResponsive,
  validateBreakpointProperty
} from "respvis-core/data/responsive-property/breakpoint-property";

export type BaseRadiusUserArgs = BreakpointPropertyUserArgs<number>
export type BaseRadius = BreakpointProperty<number> | number

export function isBaseRadiusUserArgs(args: any): args is BaseRadiusUserArgs {
  return typeof args === 'number' || isBreakpointPropertyUserArgsResponsive(args)
}

export function validateBaseRadius(args?: BaseRadiusUserArgs): BaseRadius {
  return validateBreakpointProperty(args || 5)
}
