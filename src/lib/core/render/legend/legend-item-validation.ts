import {arrayIs} from "../../utilities/array";
import {LegendValid} from "./legend-validation";
import {Size} from "../../utilities/size";

export interface LegendItem {
  label: string
  styleClass: string
  symbol: (pathElement: SVGPathElement, size: Size) => void
  key: string
}

export function legendItemData(legendData: LegendValid): LegendItem[] {
  const {
    labelCallback, categories, styleClasses,
    symbols, keys, reverse
  } = legendData;
  const items = categories.map((c, i) => {
    return {
      label: labelCallback(c),
      styleClass: arrayIs(styleClasses) ? styleClasses[i] : styleClasses,
      symbol: arrayIs(symbols) ? symbols[i] : symbols,
      key: keys[i],
    };
  });
  return reverse ? items.reverse() : items
}
