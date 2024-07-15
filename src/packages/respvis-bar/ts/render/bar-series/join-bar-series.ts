import {easeCubicOut, select, Selection} from "d3";
import {BarArgs} from "../bar";
import {
  addD3TransitionClass,
  cssLengthInPx,
  CSSLengthUnit,
  rectFitStroke,
  rectMinimized,
  rectToAttrs,
  UnitValue
} from "respvis-core";

export function joinBarSeries(
  seriesSelection: Selection,
  joinSelection: Selection<SVGRectElement, BarArgs>
): void {
  joinSelection.join(
      (enter) =>
        enter
          .append('rect')
          .classed('element bar', true)
          .each((d, i, g) => rectToAttrs(select(g[i]), rectMinimized(d)))
          .call((s) => seriesSelection.dispatch('enter', {detail: {selection: s}})),
      undefined,
      (exit) =>
        exit
          .classed('exiting', true)
          .each((d, i, g) =>
            select(g[i])
              .transition('minimize')
              .duration(250)
              .call(addD3TransitionClass)
              .call((t) => rectToAttrs(t, rectMinimized(d)))
              .remove()
          )
          .call((s) => seriesSelection.dispatch('exit', {detail: {selection: s}}))
    )
    .classed('exiting', false)
    .classed('exit-done', false)
    .attr('data-style', (d) => d.styleClass)
    .attr('data-key', (d) => d.key.rawKey)
    .each((d, i, g) =>
      select(g[i])
        .transition('position')
        .call(addD3TransitionClass)
        .duration(250)
        .ease(easeCubicOut)
        .call((t) => {
          const cssLength = select(g[i]).style('stroke-width')! as UnitValue<CSSLengthUnit>
          const strokeSize = cssLengthInPx(cssLength, select(g[i]).node()!)
          return rectToAttrs(t, rectFitStroke(d, strokeSize))
        })
    )
    .call((s) => seriesSelection.dispatch('update', {detail: {selection: s}}));
}
