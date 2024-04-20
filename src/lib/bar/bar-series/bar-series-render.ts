import {select, Selection} from "d3";
import {BarSeries} from "./bar-series";
import {BarArgs} from "../bar";
import {barSeriesJoin} from "./bar-series-join";

export function barSeriesRender(selection: Selection<Element, BarSeries>): void {
  selection
    .classed('series-bar', true)
    .each((d, i, g) => {
      const seriesS = select<Element, BarSeries>(g[i]);
      seriesS
        .selectAll<SVGRectElement, BarArgs>('rect')
        .data(d.getBarRects(), (d) => d.key)
        .call((s) => barSeriesJoin(seriesS, s));
    })
}
