import {AxisType, Orientation, Renderer, SVGHTMLElementLegacy} from "respvis-core";
import {Selection} from "d3";
import {CartesianAxis} from "../validate-cartesian-axis";

export type CartesianRenderer = Renderer & {
  get horizontalAxisS(): Selection<SVGHTMLElementLegacy, CartesianAxis>
  get verticalAxisS(): Selection<SVGHTMLElementLegacy, CartesianAxis>
  getAxisInversionState(): Record<AxisType | Orientation, boolean>
}
