import {CSSBreakpointLengthUnit, UnitValue} from "../../constants/types";
import {pxUpperLimit} from "../../constants/other";

export type BreakpointsUserArgs = {
  values: readonly number[],
  unit: CSSBreakpointLengthUnit
}
export type BreakpointsArgs = BreakpointsUserArgs
export type Breakpoints = Required<BreakpointsUserArgs>

export function validateBreakpoints(args?: BreakpointsUserArgs): Breakpoints {
  return {
    unit: args ? args.unit : 'rem',
    values: args ? args.values : [],
  }
}

export function getActiveBreakpoints(index: number, breakpoints: Breakpoints)
  : [UnitValue<CSSBreakpointLengthUnit>, UnitValue<CSSBreakpointLengthUnit>] {
  const {unit, values} = breakpoints
  const preBreak = `${index > 0 ? values[index - 1] : 0}${unit}` as const
  const postBreak = index < values.length ? `${values[index]}${unit}` as const : pxUpperLimit
  return [preBreak, postBreak]
}
