import {Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";

export type Renderer = {
    windowSelection: Selection<SVGHTMLElement>
    chartSelection?: Selection<SVGHTMLElement>
    drawAreaSelection?: Selection<SVGHTMLElement>
    xAxisSelection?: Selection<SVGHTMLElement>
    yAxisSelection?: Selection<SVGHTMLElement>
    legendSelection?: Selection<SVGHTMLElement>
}

export type RenderArgs = {
    renderer: Renderer
}
