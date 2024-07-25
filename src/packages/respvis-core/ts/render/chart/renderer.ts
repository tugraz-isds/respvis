import {Dispatch, Selection} from "d3";
import {SVGGroupingElement} from "../../constants/types";
import {ChartWindowed} from "./chart/chart";
import {Legend} from "../legend";

export type Renderer = {
  readonly filterDispatch: Dispatch<{ dataKey: string }>

  get windowS(): Selection<HTMLElement, ChartWindowed>
  get chartS(): Selection<SVGGroupingElement, ChartWindowed>
  get legendS(): Selection<SVGGroupingElement, Legend>
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
