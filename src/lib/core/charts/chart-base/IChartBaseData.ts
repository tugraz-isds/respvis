import {SeriesConfigTooltips} from "../../../tooltip";
import {Point} from "../../../points";

export interface IChartBaseData {
  title?: string;
  subtitle?: string;
  flipped?: boolean;
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>;
}
