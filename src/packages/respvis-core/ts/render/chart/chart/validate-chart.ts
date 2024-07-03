import {RenderArgs} from "../renderer";
import {RespVal, RespValUserArgs, validateRespVal} from "../../../data/responsive-value/responsive-value";
import {WindowArgs} from "../../window";
import {ComponentBreakpoints} from "../../../data/breakpoints/component-breakpoints";
import {ComponentBreakpointsUserArgs} from "../../../data/breakpoints/component-breakpoints/component-breakpoints";

export type ChartDataUserArgs = Pick<WindowArgs, 'tooltip'> & {
  breakpoints?: ComponentBreakpointsUserArgs
  title?: RespValUserArgs<string>
  subTitle?: RespValUserArgs<string>
}

export type ChartDataArgs = ChartDataUserArgs & RenderArgs

export type ChartData = Required<Omit<ChartDataArgs, 'breakpoints' | 'tooltip' | 'title' | 'subTitle'>> & {
  breakpoints: ComponentBreakpoints,
  title: RespVal<string>
  subTitle: RespVal<string>
}

export function validateChart(args: ChartDataArgs): ChartData {
  return {
    renderer: args.renderer,
    breakpoints: new ComponentBreakpoints(args.breakpoints),
    title: validateRespVal(args.title || ''),
    subTitle: validateRespVal(args.subTitle || ''),
  }
}
