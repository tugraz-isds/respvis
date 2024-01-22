import {arrayIs} from "../../utilities/array";
import {LegendValid} from "./legend-validation";
import {Size} from "../../utilities/size";
import {categoryOrderMapToArray} from "../../data/category";

export interface LegendItem {
  label: string
  styleClass: string
  symbol: (pathElement: SVGPathElement, size: Size) => void
  key: string
}

export function legendItemData(legendData: LegendValid): LegendItem[] {
  const { series,
    symbols, reverse
  } = legendData;
  const {styleClasses, keys, categoryOrderMap, labelCallback} = series
  const categoryOrderedArray = categoryOrderMapToArray(categoryOrderMap)
  const items = categoryOrderedArray.map((c, i) => {
    return {
      label: labelCallback(c),
      styleClass: arrayIs(styleClasses) ? styleClasses[i] : styleClasses,
      symbol: arrayIs(symbols) ? symbols[i] : symbols,
      key: keys[i],
    };
  });
  return reverse ? items.reverse() : items
}
