import {Dispatch, Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {ChartWindowedValid} from "./chart/chart";

export type Renderer = {
    windowS: Selection<SVGHTMLElement, ChartWindowedValid>
    readonly filterDispatch: Dispatch<{ dataKey: string }>
    xAxisS?: Selection<SVGHTMLElement>
    yAxisS?: Selection<SVGHTMLElement>
    legendS?: Selection<SVGHTMLElement>

    get chartS(): Selection<SVGHTMLElement>
    get layouterS(): Selection<SVGHTMLElement>
    get drawAreaS(): Selection<SVGHTMLElement>
    get drawAreaBgS(): Selection<SVGRectElement>

    //TODO: implement methods for selections
}

export type RenderArgs = {
    renderer: Renderer
}
