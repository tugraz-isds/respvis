import {Renderer, SVGHTMLElement} from "respvis-core";
import {Selection} from "d3";
import {CartesianAxis} from "./cartesian-axis-validation";

export type CartesianRenderer = Renderer & {
  get horizontalAxisS(): Selection<SVGHTMLElement, CartesianAxis>
  get verticalAxisS(): Selection<SVGHTMLElement, CartesianAxis>
}
