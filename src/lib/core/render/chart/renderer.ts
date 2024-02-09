import {Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {ChartWindowedValid} from "./chart/chart";

export type Renderer = {
    windowSelection: Selection<SVGHTMLElement, ChartWindowedValid>
    chartSelection?: Selection<SVGHTMLElement>
    drawAreaSelection?: Selection<SVGHTMLElement>
    xAxisSelection?: Selection<SVGHTMLElement>
    yAxisSelection?: Selection<SVGHTMLElement>
    legendSelection?: Selection<SVGHTMLElement>
}

export type RenderArgs = {
    renderer: Renderer
}
