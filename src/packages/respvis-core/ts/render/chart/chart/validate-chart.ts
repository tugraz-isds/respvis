import {RenderArgs} from "../renderer";
import {RespValOptional} from "../../../data/responsive-value/responsive-value";
import {validateBreakpoints} from "../../../data/breakpoints/breakpoints";
import {WindowArgs} from "../../window";
import {LayoutBreakpoints} from "../../../data/layout-breakpoints";

export type ChartDataUserArgs = Pick<WindowArgs, 'tooltip'> & {
  breakPoints?: Partial<LayoutBreakpoints>
  title?: RespValOptional<string>
  subTitle?: RespValOptional<string>
}

export type ChartDataArgs = ChartDataUserArgs & RenderArgs

export type ChartData = Required<Omit<ChartDataArgs, 'breakPoints' | 'tooltip'>> & {
  breakpoints: LayoutBreakpoints,
}

export function validateChart(args: ChartDataArgs): ChartData {
  return {
    renderer: args.renderer,
    breakpoints: {
      width: validateBreakpoints(args.breakPoints?.width),
      height: validateBreakpoints(args.breakPoints?.height)
    },
    title: args.title || '',
    subTitle: args.subTitle || '',
  }
}
