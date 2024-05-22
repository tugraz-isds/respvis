import {rectFromSize} from "../../utilities/graphic-elements/rect";
import {Size} from "../../utilities/size";
import {RenderArgs} from "../chart/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {Series} from "../series";
import {pathRect} from "../../utilities/path/path-rect";

export type LegendUserArgs = {
  title?: RespValOptional<string>
  symbols?:
    | ((symbol: SVGPathElement, size: Size) => void)
    | ((symbol: SVGPathElement, size: Size) => void)[]
  reverse?: boolean
}

export type LegendArgs = LegendUserArgs & RenderArgs & {
  series: Series
}

export type Legend = Required<LegendArgs> & {
  reverse: boolean
}

export function validateLegend(data: LegendArgs): Legend {
  const {renderer, series} = data
  return {
    renderer, series,
    title: data.title || '',
    reverse: data.reverse ?? false,
    symbols: data.symbols || ((e, s) => pathRect(e, rectFromSize(s))),
  };
}
