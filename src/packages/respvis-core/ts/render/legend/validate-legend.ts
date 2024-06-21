import {rectFromSize} from "../../data/shapes/rect";
import {Size} from "../../data/size";
import {RenderArgs} from "../chart/renderer";
import {RespVal, RespValUserArgs, validateRespVal} from "../../data/responsive-value/responsive-value";
import {Series} from "../series";
import {pathRect} from "../path/path-rect";

export type LegendUserArgs = {
  title?: RespValUserArgs<string>
  symbols?:
    | ((symbol: SVGPathElement, size: Size) => void)
    | ((symbol: SVGPathElement, size: Size) => void)[]
  reverse?: boolean
}

export type LegendArgs = LegendUserArgs & RenderArgs & {
  series: Series
}

export type Legend = Required<Omit<LegendArgs, 'title'>> & {
  title: RespVal<string>
  reverse: boolean
}

export function validateLegend(data: LegendArgs): Legend {
  const {renderer, series} = data
  return {
    renderer, series,
    title: validateRespVal(data.title || ''),
    reverse: data.reverse ?? false,
    symbols: data.symbols || ((e, s) => pathRect(e, rectFromSize(s))),
  };
}
