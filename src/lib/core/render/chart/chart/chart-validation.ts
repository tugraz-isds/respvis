import {LayoutBreakpoints} from "../../../data/breakpoint/breakpoint";
import {RenderArgs} from "../renderer";
import {RespValOptional} from "../../../data/responsive-value/responsive-value";
import {breakPointsValidation} from "../../../data/breakpoint/breakpoint-validation";

export type ChartArgs = RenderArgs & {
  breakPoints?: Partial<LayoutBreakpoints>
  title?: RespValOptional<string>,
  subTitle?: RespValOptional<string>;
}

export type ChartValid = Required<Omit<ChartArgs, 'breakPoints'>> & {
  breakPoints: LayoutBreakpoints,
}

export function chartValidation(args: ChartArgs): ChartValid {
  return {
    renderer: args.renderer,
    breakPoints: {
      width: breakPointsValidation(args.breakPoints?.width),
      height: breakPointsValidation(args.breakPoints?.height)
    },
    title: args.title || '',
    subTitle: args.subTitle || '',
  }
}
