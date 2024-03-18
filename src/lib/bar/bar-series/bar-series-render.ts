import {select, Selection} from "d3";
import {rectFromString} from "../../core";
import {seriesConfigTooltipsHandleEvents} from "../../tooltip";
import {BarSeries} from "./bar-series";
import {seriesBarCreateBars} from "./bar-creation.ts/bar-creation";
import {Bar} from "./bar";
import {barSeriesJoin} from "./bar-series-join";

export function barSeriesRender(selection: Selection<Element, BarSeries>): void {
  selection
    .classed('series-bar', true)
    .attr('data-ignore-layout-children', true)
    .each((d, i, g) => {
      const seriesS = select<Element, BarSeries>(g[i]);
      const boundsAttr = seriesS.attr('bounds');
      if (!boundsAttr) return;
      d.bounds = rectFromString(boundsAttr);
      seriesS
        .selectAll<SVGRectElement, Bar>('rect')
        .data(seriesBarCreateBars(d), (d) => d.key)
        .call((s) => barSeriesJoin(seriesS, s));
    })
    .on('pointerover.seriesbarhighlight pointerout.seriesbarhighlight', (e: PointerEvent) =>
      (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
    )
    .call((s) => seriesConfigTooltipsHandleEvents(s));
}
