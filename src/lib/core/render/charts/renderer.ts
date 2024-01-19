import {Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {ChartWindowValid} from "../chart-window";
import {ChartBaseValid} from "./chart-base";

export type Renderer = {
    windowSelection: Selection<SVGHTMLElement, ChartWindowValid & ChartBaseValid>
    chartSelection?: Selection<SVGHTMLElement>
    drawAreaSelection?: Selection<SVGHTMLElement>
    xAxisSelection?: Selection<SVGHTMLElement>
    yAxisSelection?: Selection<SVGHTMLElement>
    legendSelection?: Selection<SVGHTMLElement>
}

export type RenderArgs = {
    renderer: Renderer
}
