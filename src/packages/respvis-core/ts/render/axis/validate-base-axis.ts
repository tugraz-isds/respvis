import {Axis as D3Axis, AxisDomain} from 'd3';
import {RenderArgs} from "../chart/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {ScaledValues} from "../../data/scale/scaled-values-base";
import {KeyedAxis} from "./validate-keyed-axis";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import type {CartesianAxis} from "../../../../respvis-cartesian/ts";
import {Series} from "../series";
import {
  AxisLayoutHorizontal,
  AxisLayoutsHorizontal,
  AxisLayoutsVertical,
  AxisLayoutVertical
} from "../../constants/types";
import {LayoutBreakpoints} from "../../data/layout-breakpoints";
import {LayoutBreakpointsUserArgs, validateLayoutBreakpoints} from "../../data/layout-breakpoints/layout-breakpoints";

export type BaseAxisUserArgs = {
  breakPoints?: LayoutBreakpointsUserArgs
  title?: RespValOptional<string>
  subTitle?: RespValOptional<string>
  horizontalLayout?: AxisLayoutHorizontal
  verticalLayout?: AxisLayoutVertical
  configureAxis?: RespValOptional<ConfigureAxisFn>
  tickOrientation?: RespValByValueOptional<number>
  tickOrientationFlipped?: RespValByValueOptional<number>
}

export type BaseAxisArgs = BaseAxisUserArgs & RenderArgs & {
  scaledValues: ScaledValues
  series: Series
}

export type BaseAxis = Required<Omit<BaseAxisArgs, 'breakPoints'>> & {
  breakPoints: LayoutBreakpoints,
  originalAxis: BaseAxis,
  d3Axis?: D3Axis<any> //axis available after first render
}

export type Axis = BaseAxis | CartesianAxis | KeyedAxis

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function validateBaseAxis(args: BaseAxisArgs): Axis {
  const axis: Axis = {
    originalAxis: this,
    renderer: args.renderer,
    series: args.series,
    scaledValues: args.scaledValues,
    title: args.title || '',
    subTitle: args.subTitle || '',
    configureAxis: args.configureAxis || (() => {
    }),
    tickOrientation: args.tickOrientation ?? 0,
    tickOrientationFlipped: args.tickOrientationFlipped ?? 0,
    breakPoints: validateLayoutBreakpoints(args.breakPoints),
    horizontalLayout: args.horizontalLayout && AxisLayoutsHorizontal.includes(args.horizontalLayout) ?
      args.horizontalLayout : 'bottom',
    verticalLayout: args.verticalLayout && AxisLayoutsVertical.includes(args.verticalLayout) ?
      args.verticalLayout : 'left'
  }
  axis.originalAxis = axis
  return axis
}
