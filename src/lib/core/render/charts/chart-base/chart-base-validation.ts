import {SeriesConfigTooltips} from "../../../../tooltip";
import {Point} from "../../../../points";
import {Selection} from "d3";
import {LayoutBreakpoints} from "../../../data/breakpoint/breakpoint";
import {SVGHTMLElement} from "../../../constants/types";
import {RenderArgs} from "../renderer";
import {ResponsiveValueOptional} from "../../../data/responsive-value/responsive-value";
import {validateBreakpoints} from "../../../data/breakpoint/breakpoint-validation";

export type ChartBaseArgs = RenderArgs & {
  bounds?: Partial<LayoutBreakpoints>
  title?: ResponsiveValueOptional<string>,
  subTitle?: ResponsiveValueOptional<string>;
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>;
}

export type ChartBaseValid = Required<Omit<ChartBaseArgs, 'bounds' | 'markerTooltips'>> & {
  bounds: LayoutBreakpoints,
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>;
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
    markerTooltips: args.markerTooltips,
  }
}
