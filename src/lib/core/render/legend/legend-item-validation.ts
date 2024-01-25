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
  const {categories, labelCallback} = series
  if (!categories) return []

  const {orderMap, styleClasses, orderKeys} = categories! //TODO: Categories optional
  const categoryOrderedArray = categoryOrderMapToArray(orderMap)
  const items = categoryOrderedArray.map((c, i) => {
    return {
      label: labelCallback(c),
      styleClass: arrayIs(styleClasses) ? styleClasses[i] : styleClasses,
      symbol: arrayIs(symbols) ? symbols[i] : symbols,
      key: `${series.key} ${orderKeys[i]}`,
    };
  });
  return reverse ? items.reverse() : items
}
