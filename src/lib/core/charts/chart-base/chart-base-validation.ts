import {SeriesConfigTooltips} from "../../../tooltip";
import {Point} from "../../../points";
import {LengthDimensionBounds} from "../../utilities/resizing/matchBounds";
import {scaleLinear, Selection} from "d3";
import {Legend} from "../../../legend";
import {boundsValidation} from "../../utilities/resizing/bounds";
import {SVGHTMLElement} from "../../utilities/resizing/types";
import {ConfigBoundable} from "../../utilities/resizing/boundable";

export type ChartBaseArgs = {
  bounds?: Partial<LengthDimensionBounds>
  title?: ConfigBoundable<string>,
  subTitle?: ConfigBoundable<string>;
  flipped?: boolean;
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>;
}

export type ChartBaseValid = Required<Omit<ChartBaseArgs, 'bounds' | 'markerTooltips'>> & {
  bounds: LengthDimensionBounds,
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>;
  selection?: Selection<SVGHTMLElement>
}

export function chartBaseValidation(args: ChartBaseArgs): ChartBaseValid {
  return {
    bounds: {
      width: boundsValidation(args.bounds?.width),
      height: boundsValidation(args.bounds?.height)
    },
    title: args.title || '',
    subTitle: args.subTitle || '',
    flipped: !!args.flipped,
    markerTooltips: args.markerTooltips,
  }
}
