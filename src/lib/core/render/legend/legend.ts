import {rectFromSize, Size} from '../../index';
import {pathRect} from '../../index';
import {ResponsiveValueOptional} from "../../data/breakpoint/responsive-value";
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
  title?: ResponsiveValueOptional<string>
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
  keysActive: {
    [key: string]: boolean
  }
  styleClasses: string[]
}

export function legendData(data: LegendArgs): LegendValid {
  const {labelCallback, categories, renderer} = data
  const keysActive = categories.reduce((prev, c, i) => {
    prev[`s-0 c-${i}`] = true
    return prev
  }, {})
  return {
    renderer,
    title: data.title || '',
    labelCallback: labelCallback ? labelCallback : (label: string) => label,
    categories,
    keysActive,
    reverse: data.reverse ?? false,
    styleClasses: categories.map((l, i) => `categorical-${i}`),
    symbols: data.symbols || ((e, s) => pathRect(e, rectFromSize(s))),
    keys: categories.map((_, i) => `s-0 c-${i}`),
  };
}
