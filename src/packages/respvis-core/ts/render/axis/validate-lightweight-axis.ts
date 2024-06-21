import {LayoutBreakpoints, LayoutBreakpointsUserArgs,} from "../../data/layout-breakpoints/layout-breakpoints";
import {
  AxisLayoutHorizontal,
  AxisLayoutsHorizontal,
  AxisLayoutsVertical,
  AxisLayoutVertical,
  ConfigureAxisFn,
  RenderArgs,
  RespVal,
  RespValByValueOptional,
  RespValByValueUserArgs,
  RespValUserArgs,
  ScaledValuesSpatial,
  validateResponsiveValByValue,
  validateRespVal
} from "respvis-core";
import {Axis as D3Axis} from "d3-axis";

export type LightWeightAxisUserArgs = {
  breakpoints?: LayoutBreakpointsUserArgs
  title?: RespValUserArgs<string>
  subTitle?: RespValUserArgs<string>
  horizontalLayout?: AxisLayoutHorizontal
  verticalLayout?: AxisLayoutVertical
  configureAxis?: RespValUserArgs<ConfigureAxisFn>
  tickOrientation?: RespValByValueUserArgs<number>
  tickOrientationFlipped?: RespValByValueUserArgs<number>
}

export type LightWeightAxisArgs = LightWeightAxisUserArgs & RenderArgs & {
  scaledValues: ScaledValuesSpatial
}

export type LightWeightAxis = Required<Omit<LightWeightAxisArgs,
  'breakpoints' | 'tickOrientation' | 'tickOrientationFlipped' | 'title' |
  'subTitle' | 'configureAxis'>> & {
  title: RespVal<string>
  subTitle: RespVal<string>
  configureAxis: RespVal<ConfigureAxisFn>
  breakpoints: LayoutBreakpoints,
  tickOrientation: RespValByValueOptional<number>
  tickOrientationFlipped: RespValByValueOptional<number>
  d3Axis?: D3Axis<any> //axis available after first render
}

export function validateLightWeightAxis(args: LightWeightAxisArgs): LightWeightAxis {
  const axis: LightWeightAxis = {
    renderer: args.renderer,
    scaledValues: args.scaledValues,
    title: validateRespVal(args.title || ''),
    subTitle: validateRespVal(args.subTitle || ''),
    configureAxis: validateRespVal(args.configureAxis || (() => {})),
    breakpoints: new LayoutBreakpoints(args.breakpoints),
    horizontalLayout: args.horizontalLayout && AxisLayoutsHorizontal.includes(args.horizontalLayout) ?
      args.horizontalLayout : 'bottom',
    verticalLayout: args.verticalLayout && AxisLayoutsVertical.includes(args.verticalLayout) ?
      args.verticalLayout : 'left',
    tickOrientation: validateResponsiveValByValue(args.tickOrientation ?? 0),
    tickOrientationFlipped: validateResponsiveValByValue(args.tickOrientationFlipped ?? 0),
  }
  return axis
}
