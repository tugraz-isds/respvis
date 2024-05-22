import {Size} from "respvis-core/utilities";

export interface LegendItem {
  label: string
  styleClass: string
  symbol: (pathElement: SVGPathElement, size: Size) => void
  key: string
}
