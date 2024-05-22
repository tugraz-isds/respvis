import {RenderArgs} from "../renderer";
import {RespValOptional} from "../../../data/responsive-value/responsive-value";
import {validateBreakpoints, WidthAndHeightBreakpoints} from "../../../data/breakpoints/breakpoints";

export type ChartDataUserArgs = {
  breakPoints?: Partial<WidthAndHeightBreakpoints>
  title?: RespValOptional<string>,
  subTitle?: RespValOptional<string>;
}

export type ChartDataArgs = ChartDataUserArgs & RenderArgs

export type ChartData = Required<Omit<ChartDataArgs, 'breakPoints'>> & {
  breakpoints: WidthAndHeightBreakpoints,
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
