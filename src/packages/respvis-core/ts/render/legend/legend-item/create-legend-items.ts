import {arrayIs} from "../../../utilities/array";
import {Legend} from "../validate-legend";
import {categoryOrderMapToArray} from "../../../data/categories";
import {mergeKeys} from "../../../utilities/dom/key";
import {LegendItem} from "./legend-item";

export function createLegendItems(legend: Legend): LegendItem[] {
  const { series, symbols, reverse} = legend;
  const {categories} = series
  if (!categories) return []

  const {categoryOrderMap, styleClassOrder, keyOrder} = categories.categories
  const categoryOrderedArray = categoryOrderMapToArray(categoryOrderMap)
  const items = categoryOrderedArray.map((c, i) => {
    return {
      label:  categories.categories.categoryFormatMap[c],
      styleClass: styleClassOrder[i],
      symbol: arrayIs(symbols) ? symbols[i] : symbols,
      key: mergeKeys([categories.parentKey, keyOrder[i]]),
    };
  });
  return reverse ? items.reverse() : items
}
