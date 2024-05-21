import {RenderArgs} from "../renderer";
import {RespValOptional} from "../../../data/responsive-value/responsive-value";
import {validateBreakpoints, WidthAndHeightBreakpoints} from "respvis-core/data/breakpoints/breakpoints-validation";

export type ChartArgs = RenderArgs & {
  breakPoints?: Partial<WidthAndHeightBreakpoints>
  title?: RespValOptional<string>,
  subTitle?: RespValOptional<string>;
}

export type ChartValid = Required<Omit<ChartArgs, 'breakPoints'>> & {
  breakpoints: WidthAndHeightBreakpoints,
}

export function chartValidation(args: ChartArgs): ChartValid {
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
