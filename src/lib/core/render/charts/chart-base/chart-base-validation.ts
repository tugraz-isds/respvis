import {SeriesConfigTooltips} from "../../../../tooltip";
import {Point} from "../../../../points";
import {Selection} from "d3";
import {LengthDimensionBounds, validateBounds} from "../../../data/resizing/bounds";
import {SVGHTMLElement} from "../../../constants/types";
import {ConfigBoundable} from "../../../data/resizing/boundable";
import {RenderArgs} from "../renderer";

export type ChartBaseArgs = RenderArgs & {
  bounds?: Partial<LengthDimensionBounds>
  title?: ConfigBoundable<string>,
  subTitle?: ConfigBoundable<string>;
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>;
}

export type ChartBaseValid = Required<Omit<ChartBaseArgs, 'bounds' | 'markerTooltips'>> & {
  bounds: LengthDimensionBounds,
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>;
  selection?: Selection<SVGHTMLElement>
}

export function chartBaseValidation(args: ChartBaseArgs): ChartBaseValid {
  return {
    renderer: args.renderer,
    bounds: {
      width: validateBounds(args.bounds?.width),
      height: validateBounds(args.bounds?.height)
    },
    title: args.title || '',
    subTitle: args.subTitle || '',
    markerTooltips: args.markerTooltips,
  }
}
