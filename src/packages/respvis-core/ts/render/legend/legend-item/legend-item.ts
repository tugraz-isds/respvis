import {Size} from "../../../utilities/geometry/shapes";

export interface LegendItem {
  label: string
  styleClass: string
  symbol: (pathElement: SVGPathElement, size: Size) => void
  key: string
}
