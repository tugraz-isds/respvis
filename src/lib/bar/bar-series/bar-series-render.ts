import {select, Selection} from "d3";
import {BarSeries} from "./bar-series";
import {BarArgs} from "../bar";
import {barSeriesJoin} from "./bar-series-join";
import {BarStandardSeries} from "./bar-standard-series";
import {classesForSelection} from "respvis-core";

export function barSeriesRender(parentS: Selection<Element>, series: BarSeries[], ...classes: string[]) {
  const {names, selector} = classesForSelection(classes)
  return parentS.selectAll<SVGGElement, BarStandardSeries>(`${selector}.series-bar`)
    .data(series)
    .join('g')
    .classed(`${names} series-bar`, true)
    .each((d, i, g) => {
      const seriesS = select<Element, BarSeries>(g[i]);
      seriesS
        .selectAll<SVGRectElement, BarArgs>('rect')
        .data(d.getBarRects(), (d) => d.key)
        .call((s) => barSeriesJoin(seriesS, s));
    })
}
