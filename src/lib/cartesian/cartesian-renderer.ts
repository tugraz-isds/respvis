import {Renderer} from "../core/render/chart/renderer";
import {Selection} from "d3";
import {SVGHTMLElement} from "../core/constants/types";
import {CartesianAxisValid} from "./cartesian-axis-validation";

export type CartesianRenderer = Renderer & {
  get horizontalAxisS(): Selection<SVGHTMLElement, CartesianAxisValid>
  get verticalAxisS(): Selection<SVGHTMLElement, CartesianAxisValid>
}
