import {SeriesConfigTooltips} from "../../../../tooltip";
import {Point} from "../../../../points";
import {Selection} from "d3";
import {LayoutBreakpoints, validateBreakpoints} from "../../../data/breakpoint/breakpoint";
import {SVGHTMLElement} from "../../../constants/types";
import {ResponsiveValueOptional} from "../../../data/breakpoint/responsive-value";
import {RenderArgs} from "../renderer";

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
