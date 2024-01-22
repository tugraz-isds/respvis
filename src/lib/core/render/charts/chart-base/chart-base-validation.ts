import {Selection} from "d3";
import {LayoutBreakpoints} from "../../../data/breakpoint/breakpoint";
import {SVGHTMLElement} from "../../../constants/types";
import {RenderArgs} from "../renderer";
import {RespValOptional} from "../../../data/responsive-value/responsive-value";
import {validateBreakpoints} from "../../../data/breakpoint/breakpoint-validation";

export type ChartBaseArgs = RenderArgs & {
  bounds?: Partial<LayoutBreakpoints>
  title?: RespValOptional<string>,
  subTitle?: RespValOptional<string>;
}

export type ChartBaseValid = Required<Omit<ChartBaseArgs, 'bounds'>> & {
  bounds: LayoutBreakpoints,
  selection?: Selection<SVGHTMLElement>
}

export function chartBaseValidation(args: ChartBaseArgs): ChartBaseValid {
  return {
    renderer: args.renderer,
    bounds: {
      width: validateBreakpoints(args.bounds?.width),
      height: validateBreakpoints(args.bounds?.height)
    },
    title: args.title || '',
    subTitle: args.subTitle || '',
  }
}
