import {AxisLayoutHorizontal, AxisLayoutsHorizontal, AxisLayoutsVertical, AxisLayoutVertical,} from "../../constants";
import {ConfigureAxisFn} from "./validate-base-axis";
import {ComponentBreakpoints, ComponentBreakpointsUserArgs,} from "../../data/breakpoints/component-breakpoints";
import {
  BreakpointPropertyOptional,
  BreakpointPropertyUserArgs,
  ResponsiveValueOptional,
  ResponsiveValueUserArgs,
  validateBreakpointProperty,
  validateResponsiveValue
} from '../../data/responsive-property'
import {ScaledValuesSpatial} from "../../data/scale";
import {RenderArgs} from "../chart";
import {Axis as D3Axis} from "d3-axis";

export type LightWeightAxisUserArgs = {
  breakpoints?: ComponentBreakpointsUserArgs
  title?: ResponsiveValueUserArgs<string>
  subTitle?: ResponsiveValueUserArgs<string>
  horizontalLayout?: AxisLayoutHorizontal
  verticalLayout?: AxisLayoutVertical
  configureAxis?: ResponsiveValueUserArgs<ConfigureAxisFn>
  tickOrientation?: BreakpointPropertyUserArgs<number>
  tickOrientationFlipped?: BreakpointPropertyUserArgs<number>
}

export type LightWeightAxisArgs = LightWeightAxisUserArgs & RenderArgs & {
  scaledValues: ScaledValuesSpatial
}

export type LightWeightAxis = Required<Omit<LightWeightAxisArgs,
  'breakpoints' | 'tickOrientation' | 'tickOrientationFlipped' | 'title' |
  'subTitle' | 'configureAxis'>> & {
  title: ResponsiveValueOptional<string>
  subTitle: ResponsiveValueOptional<string>
  configureAxis: ResponsiveValueOptional<ConfigureAxisFn>
  breakpoints: ComponentBreakpoints,
  tickOrientation: BreakpointPropertyOptional<number>
  tickOrientationFlipped: BreakpointPropertyOptional<number>
  d3Axis?: D3Axis<any> //axis available after first render
}

export function validateLightWeightAxis(args: LightWeightAxisArgs): LightWeightAxis {
  const axis: LightWeightAxis = {
    renderer: args.renderer,
    scaledValues: args.scaledValues,
    title: validateResponsiveValue(args.title || ''),
    subTitle: validateResponsiveValue(args.subTitle || ''),
    configureAxis: validateResponsiveValue(args.configureAxis || (() => {
    })),
    breakpoints: new ComponentBreakpoints(args.breakpoints),
    horizontalLayout: args.horizontalLayout && AxisLayoutsHorizontal.includes(args.horizontalLayout) ?
      args.horizontalLayout : 'bottom',
    verticalLayout: args.verticalLayout && AxisLayoutsVertical.includes(args.verticalLayout) ?
      args.verticalLayout : 'left',
    tickOrientation: validateBreakpointProperty(args.tickOrientation ?? 0),
    tickOrientationFlipped: validateBreakpointProperty(args.tickOrientationFlipped ?? 0),
  }
  return axis
}
