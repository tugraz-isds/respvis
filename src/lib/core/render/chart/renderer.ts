import {Dispatch, Selection} from "d3";
import {SVGGroupingElement, SVGHTMLElement} from "../../constants/types";
import {ChartWindowedValid} from "./chart/chart";
import {AxisValid} from "../axis";

export type Renderer = {
    windowS: Selection<SVGHTMLElement, ChartWindowedValid>
    readonly filterDispatch: Dispatch<{ dataKey: string }>
    legendS?: Selection<SVGHTMLElement>

    get chartS(): Selection<SVGGroupingElement>
    get layouterS(): Selection<HTMLDivElement>
    get drawAreaS(): Selection<SVGGroupingElement>
    get drawAreaBgS(): Selection<SVGRectElement>
    get drawAreaClipPathS(): Selection<SVGClipPathElement>

    get xAxisS(): Selection<SVGHTMLElement, AxisValid>
    get yAxisS(): Selection<SVGHTMLElement, AxisValid>
    get horizontalAxisS(): Selection<SVGHTMLElement, AxisValid>
    get verticalAxisS(): Selection<SVGHTMLElement, AxisValid>

    //TODO: implement methods for selections
}

export type RenderArgs = {
    renderer: Renderer
}
