import {Dispatch, Selection} from "d3";
import {SVGGroupingElement, SVGHTMLElement} from "../../constants/types";
import {ChartWindowed} from "./chart/chart";

export type Renderer = {
    readonly filterDispatch: Dispatch<{ dataKey: string }>
    legendS?: Selection<SVGHTMLElement>

    get windowS(): Selection<HTMLElement, ChartWindowed>
    get chartS(): Selection<SVGGroupingElement>
    get paddingWrapperS(): Selection<SVGGroupingElement>
    get layouterS(): Selection<HTMLDivElement>
    get drawAreaS(): Selection<SVGGroupingElement>
    get drawAreaBgS(): Selection<SVGRectElement>
    get drawAreaClipPathS(): Selection<SVGClipPathElement>

    exitEnterActive(): boolean
}

export type RenderArgs = {
    renderer: Renderer
}
