import {Renderer, SVGHTMLElement} from "respvis-core";
import {Selection} from "d3";
import {CartesianAxisValid} from "./cartesian-axis-validation";

export type CartesianRenderer = Renderer & {
  get horizontalAxisS(): Selection<SVGHTMLElement, CartesianAxisValid>
  get verticalAxisS(): Selection<SVGHTMLElement, CartesianAxisValid>
}
