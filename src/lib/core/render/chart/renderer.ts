import {Dispatch, Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {ChartWindowedValid} from "./chart/chart";
import {AxisValid} from "../axis";

export type Renderer = {
    windowS: Selection<SVGHTMLElement, ChartWindowedValid>
    readonly filterDispatch: Dispatch<{ dataKey: string }>
    legendS?: Selection<SVGHTMLElement>

    get chartS(): Selection<SVGHTMLElement>
    get layouterS(): Selection<SVGHTMLElement>
    get drawAreaS(): Selection<SVGHTMLElement>
    get drawAreaBgS(): Selection<SVGRectElement>

    get xAxisS(): Selection<SVGHTMLElement, AxisValid>
    get yAxisS(): Selection<SVGHTMLElement, AxisValid>
    get horizontalAxisS(): Selection<SVGHTMLElement, AxisValid>
    get verticalAxisS(): Selection<SVGHTMLElement, AxisValid>

    //TODO: implement methods for selections
}

export type RenderArgs = {
    renderer: Renderer
}
