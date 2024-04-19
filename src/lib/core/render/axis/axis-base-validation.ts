import {Axis as D3Axis, AxisDomain} from 'd3';
import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../chart/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {breakPointsValidation} from "../../data/breakpoint/breakpoint-validation";
import {ScaledValues} from "../../data/scale/scaled-values-base";
import {KeyedAxisValid} from "./keyed-axis-validation";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";

export type AxisBaseUserArgs = {
  bounds?: Partial<LayoutBreakpoints>
  title?: RespValOptional<string>
  subTitle?: RespValOptional<string>
  configureAxis?: RespValOptional<ConfigureAxisFn>
  tickOrientation?: RespValByValueOptional<number>
  tickOrientationFlipped?: RespValByValueOptional<number>
}

export type AxisBaseArgs = AxisBaseUserArgs & RenderArgs & {
  scaledValues: ScaledValues
}

export type AxisBaseValid = Required<Omit<AxisBaseArgs, 'bounds'>> & {
  bounds: LayoutBreakpoints,
}

export type AxisValid = AxisBaseValid | KeyedAxisValid

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function axisBaseValidation(data: AxisBaseArgs): AxisValid {
  return {
    renderer: data.renderer,
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
}