import {rectFromSize, Size} from '../../index';
import {pathRect} from '../../index';
import {RenderArgs} from "../charts/renderer";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {SeriesValid} from "../series";

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
  series: SeriesValid
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
