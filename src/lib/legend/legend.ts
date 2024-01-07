import {ChartBaseValid, rectFromSize, Size} from '../core';
import {pathRect} from '../core/utilities/path';
import {ConfigBoundable} from "../core/utilities/resizing/boundable";

export enum LegendOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export interface LegendItem {
  label: string;
  styleClass: string;
  symbol: (pathElement: SVGPathElement, size: Size) => void;
  key: string;
}

export type LegendArgs = {
  title?: ConfigBoundable<string>
  labels: string[];
  symbols?:
    | ((symbol: SVGPathElement, size: Size) => void)
    | ((symbol: SVGPathElement, size: Size) => void)[];
  styleClasses?: string | string[];
  reverse?: boolean;
  keys: string[];
}

export type LegendValid = Required<LegendArgs> & {
  title: ConfigBoundable<string>
  labels: string[];
  symbols:
    | ((symbol: SVGPathElement, size: Size) => void)
    | ((symbol: SVGPathElement, size: Size) => void)[];
  styleClasses: string | string[];
  reverse?: boolean;
}

export function legendData(data: LegendArgs): LegendValid {
  return {
    title: data.title || '',
    labels: data.labels,
    reverse: data.reverse ?? false,
    styleClasses: data.styleClasses || data.labels.map((l, i) => `categorical-${i}`),
    symbols: data.symbols || ((e, s) => pathRect(e, rectFromSize(s))),
    keys: data.keys,
  };
}
