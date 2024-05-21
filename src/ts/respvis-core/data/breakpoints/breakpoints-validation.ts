import {CSSBreakpointLengthUnit, LengthDimension, UnitValue} from "../../constants/types";
import {pxUpperLimit} from "../../constants/other";

export type BreakpointsArgs = {
  values: readonly number[],
  unit: CSSBreakpointLengthUnit
}
export type Breakpoints = Required<BreakpointsArgs>
export type WidthAndHeightBreakpoints = Record<LengthDimension, Breakpoints>

export function validateBreakpoints(args?: BreakpointsArgs): Breakpoints {
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
