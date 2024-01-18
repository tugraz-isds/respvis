import {CSSLength} from "../../constants/types";

export type BreakpointsArgs = {
  values: number[],
  unit: CSSLength
}
export type BreakpointsValid = Required<BreakpointsArgs>

export function validateBreakpoints(args?: BreakpointsArgs): BreakpointsValid {
  return {
    unit: args ? args.unit : 'rem',
    values: args ? args.values : [],
  }
}
