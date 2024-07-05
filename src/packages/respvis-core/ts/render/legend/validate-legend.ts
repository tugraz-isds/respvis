import {rectFromSize} from "../../utilities/geometry/shapes/rect/rect";
import {Size} from "../../utilities/geometry/shapes/rect/size";
import {RenderArgs} from "../chart/renderer";
import {Series} from "../series";
import {pathRect} from "../path/path-rect";
import {ResponsiveValueOptional, ResponsiveValueUserArgs, validateResponsiveValue} from "../../data";

export type LegendUserArgs = {
  title?: ResponsiveValueUserArgs<string>
  symbols?:
    | ((symbol: SVGPathElement, size: Size) => void)
    | ((symbol: SVGPathElement, size: Size) => void)[]
  reverse?: boolean
}

export type LegendArgs = LegendUserArgs & RenderArgs & {
  series: Series
}

export type Legend = Required<Omit<LegendArgs, 'title'>> & {
  title: ResponsiveValueOptional<string>
  reverse: boolean
}

export function validateLegend(data: LegendArgs): Legend {
  const {renderer, series} = data
  return {
    renderer, series,
    title: validateResponsiveValue(data.title || ''),
    reverse: data.reverse ?? false,
    symbols: data.symbols || ((e, s) => pathRect(e, rectFromSize(s))),
  };
}
