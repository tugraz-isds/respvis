import {CSSBreakPointLengthUnit, UnitValue} from "../../constants/types";
import {pxUpperLimit} from "../../constants/other";

export type BreakpointsArgs = {
  values: readonly number[],
  unit: CSSBreakPointLengthUnit
}
export type BreakpointsValid = Required<BreakpointsArgs>

export function validateBreakpoints(args?: BreakpointsArgs): BreakpointsValid {
  return {
    unit: args ? args.unit : 'rem',
    values: args ? args.values : [],
  }
}

export function getActiveBreakpoints(layoutIndex: number, breakpoints: BreakpointsValid)
  : [UnitValue<CSSBreakPointLengthUnit>, UnitValue<CSSBreakPointLengthUnit>] {
  const {unit, values} = breakpoints
  const preBreak = `${layoutIndex > 0 ? values[layoutIndex - 1] : 0}${unit}` as const
  const postBreak = layoutIndex < values.length ? `${values[layoutIndex]}${unit}` as const : pxUpperLimit
  return [preBreak, postBreak]
}
