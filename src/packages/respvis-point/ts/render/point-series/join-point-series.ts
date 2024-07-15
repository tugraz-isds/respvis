import {select, Selection} from "d3";
import {Point} from "../point";
import {
  addD3TransitionClass,
  addD3TransitionClassForSelection,
  circleMinimized,
  circleToAttrs,
  cssVarFromSelection
} from "respvis-core";

//TODO: points size to css transition. Look at lines for reference!
//TODO: test use cases for scaling
export function joinPointSeries(seriesS: Selection, joinS: Selection<Element, Point>) {
  const tDurationString = cssVarFromSelection(seriesS, '--transition-time-line-enter-ms')
  const tDuration = tDurationString ? parseInt(tDurationString) : 250

  joinS.join((enter) => enter.append('circle')
      .classed('element point', true)
      .each((d, i, g) => {
        const s = select<SVGCircleElement, Point>(g[i])
        circleToAttrs(s, circleMinimized(d))
      })
      .call(addD3TransitionClassForSelection)
      .call((s) => seriesS.dispatch('enter', {detail: {selection: s}}))
    , undefined,
    (exit) =>
      exit.classed('exiting', true)
        .transition().duration(tDuration)
        .call(addD3TransitionClass)
        .each((d, i, g) => {
          const t = select(g[i])
            .transition('minimize')
            .duration(tDuration)
            .call(addD3TransitionClass)
          circleToAttrs(t, circleMinimized(d))
        }).on('end', () => {
        exit.remove()
      }).call((s) => seriesS.dispatch('exit', {detail: {selection: s}}))
  )

  joinS
    .attr('cx', (d) => d.center.x)
    .attr('cy', (d) => d.center.y)
    .attr('data-style', (d) => !d.color ? d.styleClass : null)
    .attr('fill', (d) => d.color ? d.color : null)
    .attr('data-key', (d) => d.key.getRawKey())
    .call((s) => seriesS.dispatch('update', {detail: {selection: s}}))
    .each(function (d, i, g) {
      const s = select<Element, Point>(g[i])
      if (s.classed('mid-d3-transit')) {
        s.interrupt()
          .transition('maximize')
          .duration(tDuration)
          .attr('r', d => d.radius)
          .call(addD3TransitionClass)
      } else {
        s.attr('r', (d) => d.radius)
      }
    })
}
