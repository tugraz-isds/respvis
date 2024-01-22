import {Axis as D3Axis, AxisDomain} from 'd3';
import {AxisScale} from "../../data/scale/axis-scale-validation";
import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../charts/renderer";
import {
  TickOrientationArgs,
  TickOrientationValid,
  tickOrientationValidation
} from "../../data/tick-orientation/tick-orientation-validation";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {validateBreakpoints} from "../../data/breakpoint/breakpoint-validation";

export type AxisUserArgs = {
  bounds?: Partial<LayoutBreakpoints>
  title?: RespValOptional<string>,
  subTitle?: RespValOptional<string>,
  configureAxis?: RespValOptional<ConfigureAxisFn>,
  tickOrientation?: TickOrientationArgs
}

export type AxisArgs = AxisUserArgs & RenderArgs & {
  scale: AxisScale<AxisDomain>,
}

export type AxisValid = Required<Omit<AxisArgs, 'tickOrientation' | 'bounds'>> & {
  tickOrientation: TickOrientationValid,
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
    tickOrientation: tickOrientationValidation(data.tickOrientation),
    bounds: {
      width: validateBreakpoints(data.bounds?.width),
      height: validateBreakpoints(data.bounds?.height)
    }
  }
}
