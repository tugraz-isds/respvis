import {pathRect} from "../../utilities/path";
import {rectFromSize} from "../../utilities/rect";
import {Size} from "../../utilities/size";
import {RenderArgs} from "../chart/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {Series} from "../series";

export enum LegendOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export type LegendUserArgs =  {
  title?: RespValOptional<string>
  symbols?:
    | ((symbol: SVGPathElement, size: Size) => void)
    | ((symbol: SVGPathElement, size: Size) => void)[]
  reverse?: boolean
}

export type LegendArgs = LegendUserArgs & RenderArgs & {
  series: Series
}

export type LegendValid = Required<LegendArgs> & {
  reverse: boolean
}

export function legendValidation(data: LegendArgs): LegendValid {
  const {renderer, series} = data
  return {
    renderer, series,
    title: data.title || '',
    reverse: data.reverse ?? false,
    symbols: data.symbols || ((e, s) => pathRect(e, rectFromSize(s))),
  };
}
