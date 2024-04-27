import {Axis as D3Axis, AxisDomain} from 'd3';
import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../chart/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {breakPointsValidation} from "../../data/breakpoint/breakpoint-validation";
import {ScaledValues} from "../../data/scale/scaled-values-base";
import {KeyedAxisValid} from "./keyed-axis-validation";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {CartesianAxisValid} from "../../../cartesian/cartesian-axis-validation";
import {Series} from "../series";

export type BaseAxisUserArgs = {
  bounds?: Partial<LayoutBreakpoints>
  title?: RespValOptional<string>
  subTitle?: RespValOptional<string>
  configureAxis?: RespValOptional<ConfigureAxisFn>
  tickOrientation?: RespValByValueOptional<number>
  tickOrientationFlipped?: RespValByValueOptional<number>
}

export type BaseAxisArgs = BaseAxisUserArgs & RenderArgs & {
  scaledValues: ScaledValues
  series: Series
}

export type BaseAxisValid = Required<Omit<BaseAxisArgs, 'bounds'>> & {
  bounds: LayoutBreakpoints,
  originalAxis: BaseAxisValid,
  d3Axis?: D3Axis<any> //axis available after first render
}

export type AxisValid = BaseAxisValid | CartesianAxisValid | KeyedAxisValid

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function baseAxisValidation(data: BaseAxisArgs): AxisValid {
  const axis = {
    originalAxis: this,
    renderer: data.renderer,
    series: data.series,
    scaledValues: data.scaledValues,
    title: data.title || '',
    subTitle: data.subTitle || '',
    configureAxis: data.configureAxis || (() => {
    }),
    tickOrientation: data.tickOrientation ?? 0,
    tickOrientationFlipped: data.tickOrientationFlipped ?? 0,
    bounds: {
      width: breakPointsValidation(data.bounds?.width),
      height: breakPointsValidation(data.bounds?.height)
    }
  }
  axis.originalAxis = axis
  return axis
}
