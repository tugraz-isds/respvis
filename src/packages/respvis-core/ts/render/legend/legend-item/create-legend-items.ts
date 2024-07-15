import {Legend} from "../validate-legend";
import {LegendItem} from "./legend-item";

export function createLegendItems(legend: Legend): LegendItem[] {
  const { series, symbols, reverse} = legend;
  const {categories} = series
  if (!categories) return []

  const items = categories.categories.categoryArray.map((c, i) => {
    return {
      label: c.formatValue,
      styleClass: c.styleClass,
      symbol: Array.isArray(symbols) ? symbols[i] : symbols,
      key: c.key.getRawKey(),
    };
  });
  return reverse ? items.reverse() : items
}
