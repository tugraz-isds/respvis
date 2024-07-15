import {select, Selection} from "d3";
import {BarSeries} from "./bar-series";
import {BarArgs} from "../bar";
import {joinBarSeries} from "./join-bar-series";
import {BarStandardSeries} from "./bar-standard-series";
import {createSelectionClasses} from "respvis-core";

export function renderBarSeries(parentS: Selection<Element>, series: BarSeries[], ...classes: string[]) {
  const {classString, selector} = createSelectionClasses(classes)
  return parentS.selectAll<SVGGElement, BarStandardSeries>(`${selector}.series-bar`)
    .data(series)
    .join('g')
    .classed(`${classString} series-bar`, true)
    .each((d, i, g) => {
      const seriesS = select<Element, BarSeries>(g[i]);
      seriesS
        .selectAll<SVGRectElement, BarArgs>('rect')
        .data(d.getBarRects(), (d) => d.key.getRawKey())
        .call((s) => joinBarSeries(seriesS, s));
    })
}
