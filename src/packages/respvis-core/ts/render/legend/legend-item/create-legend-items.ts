import {arrayIs} from "../../../utilities/array";
import {Legend} from "../validate-legend";
import {mergeKeys} from "../../../utilities/dom/key";
import {LegendItem} from "./legend-item";

export function createLegendItems(legend: Legend): LegendItem[] {
  const { series, symbols, reverse} = legend;
  const {categories} = series
  if (!categories) return []

  const items = categories.categories.categoryArray.map((c, i) => {
    return {
      label: c.formatValue,
      styleClass: c.styleClass,
      symbol: arrayIs(symbols) ? symbols[i] : symbols,
      key: mergeKeys([categories.parentKey, c.key]),
    };
  });
  return reverse ? items.reverse() : items
}
