import {AxisValid} from "../axis";
import {LegendValid} from "../legend";
import {Size} from "../../utilities/size";
import {SeriesConfigTooltips, seriesConfigTooltipsData} from "../../../tooltip";
import {RenderArgs} from "../charts/renderer";
import {Point} from "../../../points";

export type SeriesArgs = Partial<SeriesConfigTooltips<SVGCircleElement, Point>> & RenderArgs & {
  x: AxisValid
  y: AxisValid
  key: string
  legend: LegendValid
  bounds?: Size,
  flipped?: boolean
}

export type SeriesValid = Required<SeriesArgs> & {}
export function seriesValidation(data: SeriesArgs): SeriesValid {
  const {x, y, key, legend, renderer} = data
  return {x, y,
    renderer,
    legend,
    key,
    bounds: data.bounds || { width: 600, height: 400 },
    flipped: data.flipped || false,
    ...seriesConfigTooltipsData(data), //TODO: fix tooltips for all charts
  }
}
