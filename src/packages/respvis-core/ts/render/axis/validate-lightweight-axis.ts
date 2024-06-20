import {
  LayoutBreakpoints,
  LayoutBreakpointsUserArgs,
  validateLayoutBreakpoints
} from "../../data/layout-breakpoints/layout-breakpoints";
import {
  AxisLayoutHorizontal,
  AxisLayoutsHorizontal,
  AxisLayoutsVertical,
  AxisLayoutVertical,
  ConfigureAxisFn,
  RenderArgs,
  RespValByValueOptional,
  RespValOptional,
  ScaledValuesSpatial
} from "respvis-core";
import {Axis as D3Axis} from "d3-axis";

export type LightWeightAxisUserArgs = {
  breakPoints?: LayoutBreakpointsUserArgs
  title?: RespValOptional<string>
  subTitle?: RespValOptional<string>
  horizontalLayout?: AxisLayoutHorizontal
  verticalLayout?: AxisLayoutVertical
  configureAxis?: RespValOptional<ConfigureAxisFn>
  tickOrientation?: RespValByValueOptional<number>
  tickOrientationFlipped?: RespValByValueOptional<number>
}

export type LightWeightAxisArgs = LightWeightAxisUserArgs & RenderArgs & {
  scaledValues: ScaledValuesSpatial
}

export type LightWeightAxis = Required<Omit<LightWeightAxisArgs, 'breakPoints'>> & {
  breakPoints: LayoutBreakpoints,
  d3Axis?: D3Axis<any> //axis available after first render
}

export function validateLightWeightAxis(args: LightWeightAxisArgs): LightWeightAxis {
  const axis: LightWeightAxis = {
    renderer: args.renderer,
    scaledValues: args.scaledValues,
    title: args.title || '',
    subTitle: args.subTitle || '',
    configureAxis: args.configureAxis || (() => {
    }),
    breakPoints: validateLayoutBreakpoints(args.breakPoints),
    horizontalLayout: args.horizontalLayout && AxisLayoutsHorizontal.includes(args.horizontalLayout) ?
      args.horizontalLayout : 'bottom',
    verticalLayout: args.verticalLayout && AxisLayoutsVertical.includes(args.verticalLayout) ?
      args.verticalLayout : 'left',
    tickOrientation: args.tickOrientation ?? 0,
    tickOrientationFlipped: args.tickOrientationFlipped ?? 0,
  }
  return axis
}
