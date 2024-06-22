import {select, Selection} from "d3";
import {Point} from "../point";
import {addTransitionClass, circleMinimized, circleToAttrs} from "respvis-core";

//TODO: points size to css transition. Look at lines for reference!
//TODO: test use cases for scaling
export function joinPointSeries(
  seriesSelection: Selection,
  joinSelection: Selection<Element, Point>
): void {
  joinSelection
    .join(
      (enter) => enter
        .append('circle')
        .classed('element point', true)
        .each((d, i, g) => {
          const s = select<SVGCircleElement, Point>(g[i])
          circleToAttrs(s, circleMinimized(d))
          s.transition('maximize')
            .duration(250)
            .attr('r', (d) => d.radius)
            .call(addTransitionClass)
        })
        .call((s) => seriesSelection.dispatch('enter', {detail: {selection: s}}))
      , undefined
      , (exit) =>
        exit
          .classed('exiting', true)
          .transition().duration(250)
          .call(addTransitionClass)
          .each((d, i, g) => {
            const t = select(g[i])
              .transition('minimize')
              .duration(250)
              .call(addTransitionClass)
            circleToAttrs(t, circleMinimized(d))
          }).on('end', () => {
          exit.remove()
        }).call((s) => seriesSelection.dispatch('exit', {detail: {selection: s}}))
    )
    .attr('cx', (d) => d.center.x)
    .attr('cy', (d) => d.center.y)
    .attr('r', (d) => d.radius)
    .attr('data-style', (d) => !d.color ? d.styleClass : null)
    .attr('fill', (d) => d.color ? d.color : null)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesSelection.dispatch('update', {detail: {selection: s}}));
}
