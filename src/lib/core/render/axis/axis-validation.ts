import {Axis as D3Axis, AxisDomain} from 'd3';
import {AxisScale} from "../../data/scale/axis-scale-validation";
import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../charts/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {validateBreakpoints} from "../../data/breakpoint/breakpoint-validation";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";

export type AxisUserArgs = {
  bounds?: Partial<LayoutBreakpoints>
  title?: RespValOptional<string>,
  subTitle?: RespValOptional<string>,
  configureAxis?: RespValOptional<ConfigureAxisFn>,
  tickOrientation?: RespValByValueOptional<number>
  tickOrientationFlipped?: RespValByValueOptional<number>
}

export type AxisArgs = AxisUserArgs & RenderArgs & {
  scale: AxisScale<AxisDomain>
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
    scale: data.scale,
    title: data.title || '',
    subTitle: data.subTitle || '',
    configureAxis: data.configureAxis || (() => {
    }),
    tickOrientation: data.tickOrientation ?? 0,
    tickOrientationFlipped: data.tickOrientationFlipped ?? 0,
    bounds: {
      width: validateBreakpoints(data.bounds?.width),
      height: validateBreakpoints(data.bounds?.height)
    }
  }
}
