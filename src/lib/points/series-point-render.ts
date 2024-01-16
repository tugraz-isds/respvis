import {easeCubicOut, select, Selection} from "d3";
import {circleMinimized, circleToAttrs, rectFromString} from "../core";
import {seriesConfigTooltipsHandleEvents} from "../tooltip";
import {Point, seriesPointCreatePoints, SeriesPointValid} from "./series-point-validation";

export function seriesPointRender(selection: Selection<Element, SeriesPointValid>): void {
  selection
    .classed('series-point', true)
    .attr('data-ignore-layout-children', true)
    .each((d, i, g) => {
      const seriesS = select<Element, SeriesPointValid>(g[i]);
      const boundsAttr = seriesS.attr('bounds');
      if (!boundsAttr) return;
      d.bounds = rectFromString(boundsAttr);
      seriesS
        .selectAll<SVGCircleElement, Point>('.point')
        .data(seriesPointCreatePoints(d), (d) => d.key)
        .call((s) => seriesPointJoin(seriesS, s));
    })
    .on('pointerover.seriespointhighlight pointerout.seriespointhighlight', (e: PointerEvent) =>
      (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
    )
    .call((s) => seriesConfigTooltipsHandleEvents(s));
}

export function seriesPointJoin(
  seriesSelection: Selection,
  joinSelection: Selection<Element, Point>
): void {
  joinSelection
    .join(
      (enter) => {
        return enter
          .append('circle')
          .classed('point', true)
          .each((d, i, g) => {
            const s = select(g[i])
            circleToAttrs(s, circleMinimized(d))
          })
          .call((s) => seriesSelection.dispatch('enter', {detail: {selection: s}}))
      }, undefined,
      (exit) =>
        exit
          .classed('exiting', true)
          .call((s) =>
            s
              .transition('exit')
              .duration(250)
              .each((d, i, g) => {
                const t = select(g[i]).transition('minimize').duration(250)
                return circleToAttrs(t, circleMinimized(d))
              })
              .remove()
          )
          .call((s) => seriesSelection.dispatch('exit', {detail: {selection: s}}))
    )
    .attr('cx', (d) => d.center.x)
    .attr('cy', (d) => d.center.y)
    .each((d, i, g) => {
      const s = select(g[i])
      const t = s.transition('update').ease(easeCubicOut)
      circleToAttrs(t, d)
    })
    .attr('data-style', (d) => !d.color ? d.styleClass : null)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesSelection.dispatch('update', {detail: {selection: s}}));
}
