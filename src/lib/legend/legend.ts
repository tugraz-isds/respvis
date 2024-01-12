import {rectFromSize, Size} from '../core';
import {pathRect} from '../core';
import {ConfigBoundable} from "../core/utilities/resizing/boundable";

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

export type LegendArgsUser = {
  title?: ConfigBoundable<string>
  labelCallback?: (category: string) => string
  symbols?:
    | ((symbol: SVGPathElement, size: Size) => void)
    | ((symbol: SVGPathElement, size: Size) => void)[]
  reverse?: boolean
}

export type LegendArgs = LegendArgsUser & {
  categories: string[]
}

export type LegendValid = Required<LegendArgs> & {
  reverse: boolean
  keys: string[]
  styleClasses: string[]
}

export function legendData(data: LegendArgs): LegendValid {
  const {labelCallback, categories} = data
  return {
    title: data.title || '',
    labelCallback: labelCallback ? labelCallback : (label: string) => label,
    categories,
    reverse: data.reverse ?? false,
    styleClasses: categories.map((l, i) => `categorical-${i}`),
    symbols: data.symbols || ((e, s) => pathRect(e, rectFromSize(s))),
    keys: categories.map((_, i) => `s-0 c-${i}`),
  };
}
