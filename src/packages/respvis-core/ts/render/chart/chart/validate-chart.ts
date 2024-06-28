import {RenderArgs} from "../renderer";
import {RespVal, RespValUserArgs, validateRespVal} from "../../../data/responsive-value/responsive-value";
import {WindowArgs} from "../../window";
import {LayoutBreakpoints} from "../../../data/layout-breakpoints";
import {LayoutBreakpointsUserArgs} from "../../../data/layout-breakpoints/layout-breakpoints";

export type ChartDataUserArgs = Pick<WindowArgs, 'tooltip'> & {
  breakpoints?: LayoutBreakpointsUserArgs
  title?: RespValUserArgs<string>
  subTitle?: RespValUserArgs<string>
}

export type ChartDataArgs = ChartDataUserArgs & RenderArgs

export type ChartData = Required<Omit<ChartDataArgs, 'breakpoints' | 'tooltip' | 'title' | 'subTitle'>> & {
  breakpoints: LayoutBreakpoints,
  title: RespVal<string>
  subTitle: RespVal<string>
}

export function validateChart(args: ChartDataArgs): ChartData {
  return {
    renderer: args.renderer,
    breakpoints: new LayoutBreakpoints(args.breakpoints),
    title: validateRespVal(args.title || ''),
    subTitle: validateRespVal(args.subTitle || ''),
  }
}
