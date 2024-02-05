import {arrayIs} from "../../utilities/array";
import {LegendValid} from "./legend-validation";
import {Size} from "../../utilities/size";
import {categoryOrderMapToArray} from "../../data/category";
import {mergekeys} from "../../utilities/dom/key";

export interface LegendItem {
  label: string
  styleClass: string
  symbol: (pathElement: SVGPathElement, size: Size) => void
  key: string
}

export function legendItemData(legendData: LegendValid): LegendItem[] {
  const { series, symbols, reverse} = legendData;
  const {categories, labelCallback} = series
  if (!categories) return []

  const {categoryOrderMap, styleClassOrder, keyOrder} = categories.categories
  const categoryOrderedArray = categoryOrderMapToArray(categoryOrderMap)
  const items = categoryOrderedArray.map((c, i) => {
    return {
      label: labelCallback(c),
      styleClass: styleClassOrder[i],
      symbol: arrayIs(symbols) ? symbols[i] : symbols,
      key: mergekeys([categories.parentKey, keyOrder[i]]),
    };
  });
  return reverse ? items.reverse() : items
}
