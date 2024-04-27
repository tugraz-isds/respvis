import {Dispatch, Selection} from "d3";
import {SVGGroupingElement, SVGHTMLElement} from "../../constants/types";
import {ChartWindowedValid} from "./chart/chart";

export type Renderer = {
    readonly filterDispatch: Dispatch<{ dataKey: string }>
    legendS?: Selection<SVGHTMLElement>

    get windowS(): Selection<HTMLElement, ChartWindowedValid>
    get chartS(): Selection<SVGGroupingElement>
    get layouterS(): Selection<HTMLDivElement>
    get drawAreaS(): Selection<SVGGroupingElement>
    get drawAreaBgS(): Selection<SVGRectElement>
    get drawAreaClipPathS(): Selection<SVGClipPathElement>
}

export type RenderArgs = {
    renderer: Renderer
}
