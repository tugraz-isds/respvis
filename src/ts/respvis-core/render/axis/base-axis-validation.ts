import {Axis as D3Axis, AxisDomain} from 'd3';
import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../chart/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {breakPointsValidation} from "../../data/breakpoint/breakpoint-validation";
import {ScaledValues} from "../../data/scale/scaled-values-base";
import {KeyedAxisValid} from "./keyed-axis-validation";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {CartesianAxisValid} from "../../../respvis-cartesian/cartesian-axis-validation";
import {Series} from "../series";
import {
  AxisLayoutHorizontal,
  AxisLayoutsHorizontal,
  AxisLayoutsVertical,
  AxisLayoutVertical
} from "../../constants/types";

export type BaseAxisUserArgs = {
  breakPoints?: Partial<LayoutBreakpoints>
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

export type BaseAxisValid = Required<Omit<BaseAxisArgs, 'breakPoints'>> & {
  breakPoints: LayoutBreakpoints,
  originalAxis: BaseAxisValid,
  d3Axis?: D3Axis<any> //axis available after first render
}

export type AxisValid = BaseAxisValid | CartesianAxisValid | KeyedAxisValid

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function baseAxisValidation(args: BaseAxisArgs): AxisValid {
  const axis: AxisValid = {
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
    breakPoints: {
      width: breakPointsValidation(args.breakPoints?.width),
      height: breakPointsValidation(args.breakPoints?.height)
    },
    horizontalLayout: args.horizontalLayout && AxisLayoutsHorizontal.includes(args.horizontalLayout) ?
      args.horizontalLayout : 'bottom',
    verticalLayout: args.verticalLayout && AxisLayoutsVertical.includes(args.verticalLayout) ?
      args.verticalLayout : 'left'
  }
  axis.originalAxis = axis
  return axis
}
