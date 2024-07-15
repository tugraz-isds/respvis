import {RenderArgs} from "../renderer";
import {WindowArgs} from "../../window";
import {ComponentBreakpoints} from "../../../data/breakpoints/component-breakpoints";
import {ComponentBreakpointsUserArgs} from "../../../data/breakpoints/component-breakpoints/component-breakpoints";
import {ResponsiveValueOptional, ResponsiveValueUserArgs, validateResponsiveValue} from "../../../data";

export type ChartDataUserArgs = Pick<WindowArgs, 'tooltip'> & {
  breakpoints?: ComponentBreakpointsUserArgs
  title?: ResponsiveValueUserArgs<string>
  subTitle?: ResponsiveValueUserArgs<string>
}

export type ChartDataArgs = ChartDataUserArgs & RenderArgs

export type ChartData = Required<Omit<ChartDataArgs, 'breakpoints' | 'tooltip' | 'title' | 'subTitle'>> & {
  breakpoints: ComponentBreakpoints,
  title: ResponsiveValueOptional<string>
  subTitle: ResponsiveValueOptional<string>
}

export function validateChart(args: ChartDataArgs): ChartData {
  return {
    renderer: args.renderer,
    breakpoints: new ComponentBreakpoints(args.breakpoints),
    title: validateResponsiveValue(args.title || ''),
    subTitle: validateResponsiveValue(args.subTitle || ''),
  }
}
