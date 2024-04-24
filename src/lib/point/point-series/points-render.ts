import {select, Selection} from "d3";
import {circleMinimized, circleToAttrs} from "../../core";
import {Point} from "./point";

export function pointsRender(seriesS: Selection, points: Point[]) {
  seriesS.selectAll<SVGCircleElement, Point>('.point')
    .data(points, (d) => d.key)
    .call((s) => pointSeriesJoin(seriesS, s));
  return seriesS
}

export function pointSeriesJoin(
  seriesSelection: Selection,
  joinSelection: Selection<Element, Point>
): void {
  joinSelection
    .join(
      (enter) => {
        return enter
          .append('circle')
          .classed('element point', true)
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
              }).on('end', () => {
              exit.remove()
            })
          )
          .call((s) => seriesSelection.dispatch('exit', {detail: {selection: s}}))
    )
    .each((d, i, g) => {
      const s = select(g[i])
      //TODO: find optimal way to configure transitions for points
      // const t = s.transition('update').ease(easeCubicOut)
      s.attr('cx', d.center.x)
        .attr('cy', d.center.y)
      circleToAttrs(s, d)
    })
    .attr('data-style', (d) => !d.color ? d.styleClass : null)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesSelection.dispatch('update', {detail: {selection: s}}));
}
