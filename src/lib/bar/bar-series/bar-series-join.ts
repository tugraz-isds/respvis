import {easeCubicOut, select, Selection, Transition} from "d3";
import {BarArgs} from "../bar";
import {rectFitStroke, rectMinimized, rectToAttrs} from "core/utilities/graphic-elements/rect";
import {cssLengthInPx} from "core/utilities/dom/units";
import {CSSLengthUnit, UnitValue} from "core/constants/types";
import {addTransitionClass} from "core/utilities/d3/transition";

export interface JoinEvent<GElement extends Element, Datum>
  extends CustomEvent<{ selection: Selection<GElement, Datum> }> {
}

export interface JoinTransitionEvent<GElement extends Element, Datum>
  extends CustomEvent<{ transition: Transition<GElement, Datum> }> {
}

export function barSeriesJoin(
  seriesSelection: Selection,
  joinSelection: Selection<SVGRectElement, BarArgs>
): void {
  joinSelection
    .join(
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
              .call(addTransitionClass)
              .call((t) => rectToAttrs(t, rectMinimized(d)))
              .remove()
          )
          .call((s) => seriesSelection.dispatch('exit', {detail: {selection: s}}))
    )
    .each((d, i, g) =>
      select(g[i])
        .transition('position')
        .call(addTransitionClass)
        .duration(250)
        .ease(easeCubicOut)
        .call((t) => {
          const cssLength = select(g[i]).style('stroke-width')! as UnitValue<CSSLengthUnit>
          const strokeSize = cssLengthInPx(cssLength, select(g[i]).node()!)
          return rectToAttrs(t, rectFitStroke(d, strokeSize))
        })
    )
    .attr('data-style', (d) => d.styleClass)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesSelection.dispatch('update', {detail: {selection: s}}));
}
