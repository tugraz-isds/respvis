import {rectFromSize, Size} from '../../index';
import {pathRect} from '../../index';
import {ConfigBoundable} from "../../data/resizing/boundable";
import {RenderArgs} from "../charts/renderer";

export enum LegendOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export interface LegendItem {
  label: string
  styleClass: string
  symbol: (pathElement: SVGPathElement, size: Size) => void
  key: string
}

export type LegendArgsUser =  {
  title?: ConfigBoundable<string>
  labelCallback?: (category: string) => string
  symbols?:
    | ((symbol: SVGPathElement, size: Size) => void)
    | ((symbol: SVGPathElement, size: Size) => void)[]
  reverse?: boolean
}

export type LegendArgs = LegendArgsUser & RenderArgs & {
  categories: string[]
}

export type LegendValid = Required<LegendArgs> & {
  reverse: boolean
  keys: string[]
  styleClasses: string[]
}

export function legendData(data: LegendArgs): LegendValid {
  const {labelCallback, categories, renderer} = data
  return {
    renderer,
    title: data.title || '',
    labelCallback: labelCallback ? labelCallback : (label: string) => label,
    categories,
    reverse: data.reverse ?? false,
    styleClasses: categories.map((l, i) => `categorical-${i}`),
    symbols: data.symbols || ((e, s) => pathRect(e, rectFromSize(s))),
    keys: categories.map((_, i) => `s-0 c-${i}`),
  };
}
