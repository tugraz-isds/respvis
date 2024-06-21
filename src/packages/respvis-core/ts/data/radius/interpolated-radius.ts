import {
  isRespValInterpolatedUserArgsResponsive,
  RespValInterpolated,
  RespValInterpolatedUserArgs,
  validateRespValInterpolated
} from "../responsive-value/responsive-value-interpolated";

export type InterpolatedRadiusUserArgs = RespValInterpolatedUserArgs<number>
export type InterpolatedRadius = RespValInterpolated<number> | number

export function isInterpolatedRadiusUserArgs(args: any): args is InterpolatedRadiusUserArgs {
  return typeof args === 'number' || isRespValInterpolatedUserArgsResponsive(args)
}

export function validateInterpolatedRadius(args?: InterpolatedRadiusUserArgs): InterpolatedRadius {
  return validateRespValInterpolated(args || 5)
}
