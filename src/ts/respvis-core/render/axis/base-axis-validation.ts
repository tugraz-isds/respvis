import {Axis as D3Axis, AxisDomain} from 'd3';
import {RenderArgs} from "../chart/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {validateBreakpoints, WidthAndHeightBreakpoints} from "respvis-core/data/breakpoints/breakpoints-validation";
import {ScaledValues} from "../../data/scale/scaled-values-base";
import {KeyedAxis} from "./keyed-axis-validation";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {CartesianAxis} from "respvis-cartesian";
import {Series} from "../series";
import {
  AxisLayoutHorizontal,
  AxisLayoutsHorizontal,
  AxisLayoutsVertical,
  AxisLayoutVertical
} from "../../constants/types";

export type BaseAxisUserArgs = {
  breakPoints?: Partial<WidthAndHeightBreakpoints>
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
  breakPoints: WidthAndHeightBreakpoints,
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
    breakPoints: {
      width: validateBreakpoints(args.breakPoints?.width),
      height: validateBreakpoints(args.breakPoints?.height)
    },
    horizontalLayout: args.horizontalLayout && AxisLayoutsHorizontal.includes(args.horizontalLayout) ?
      args.horizontalLayout : 'bottom',
    verticalLayout: args.verticalLayout && AxisLayoutsVertical.includes(args.verticalLayout) ?
      args.verticalLayout : 'left'
  }
  axis.originalAxis = axis
  return axis
}
