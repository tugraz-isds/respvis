import {LayoutBreakpoints} from "../../../data/breakpoint/breakpoint";
import {RenderArgs} from "../renderer";
import {RespValOptional} from "../../../data/responsive-value/responsive-value";
import {breakPointsValidation} from "../../../data/breakpoint/breakpoint-validation";

export type ChartArgs = RenderArgs & {
  bounds?: Partial<LayoutBreakpoints>
  title?: RespValOptional<string>,
  subTitle?: RespValOptional<string>;
}

export type ChartValid = Required<Omit<ChartArgs, 'bounds'>> & {
  bounds: LayoutBreakpoints,
}

export function chartValidation(args: ChartArgs): ChartValid {
  return {
    renderer: args.renderer,
    bounds: {
      width: breakPointsValidation(args.bounds?.width),
      height: breakPointsValidation(args.bounds?.height)
    },
    title: args.title || '',
    subTitle: args.subTitle || '',
  }
}
