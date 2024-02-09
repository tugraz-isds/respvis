import {Axis as D3Axis, AxisDomain} from 'd3';
import {AxisDomainRV} from "../../data/scale/axis-scaled-values-validation";
import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../chart/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {breakPointsValidation} from "../../data/breakpoint/breakpoint-validation";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {ScaledValuesBase} from "../../data/scale/scaled-values-base";

export type AxisUserArgs = {
  bounds?: Partial<LayoutBreakpoints>
  title?: RespValOptional<string>
  subTitle?: RespValOptional<string>
  configureAxis?: RespValOptional<ConfigureAxisFn>
  tickOrientation?: RespValByValueOptional<number>
  tickOrientationFlipped?: RespValByValueOptional<number>
}

export type AxisArgs = AxisUserArgs & RenderArgs & {
  scaledValues: ScaledValuesBase<AxisDomainRV>
}

export type AxisValid = Required<Omit<AxisArgs, 'bounds'>> & {
  bounds: LayoutBreakpoints,
}

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function axisValidation(data: AxisArgs): AxisValid {
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
