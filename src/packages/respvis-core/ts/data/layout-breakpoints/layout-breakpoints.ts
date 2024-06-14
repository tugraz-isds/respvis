import {LengthDimension} from "../../constants";
import {Breakpoints, BreakpointsUserArgs, validateBreakpoints} from "../breakpoints/breakpoints";

export type LayoutBreakpointsUserArgs = Partial<Record<LengthDimension, BreakpointsUserArgs>>
export type LayoutBreakpointsArgs = LayoutBreakpointsUserArgs
export type LayoutBreakpoints = Record<LengthDimension, Breakpoints>

export function validateLayoutBreakpoints(args?: LayoutBreakpointsArgs) {
  return {
    width: validateBreakpoints(args?.width),
    height: validateBreakpoints(args?.height)
  }
}
