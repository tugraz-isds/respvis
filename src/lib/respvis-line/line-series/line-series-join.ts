import {select, Selection} from "d3";
import {Line} from "./line";
import {addEnterClass, addExitClass, cancelExitClassOnUpdate, cssVarFromSelection, pathLine} from "respvis-core";

export function lineSeriesJoin(seriesS: Selection<Element>, joinS: Selection<Element, Line>) {
  const tDurationString = cssVarFromSelection(seriesS, '--transition-time-line-enter-ms')
  const tDuration = tDurationString ? parseInt(tDurationString) : 250
  joinS
    .join(
      (enter) =>
        enter.append('path')
          .classed('line', true)
          .call(s => {
            addEnterClass(s, tDuration)
          })
          .call((s) => seriesS.dispatch('enter', {detail: {selection: s}})),
      (update) => update.call(() => {
        update.call(cancelExitClassOnUpdate)
      }),
      (exit) =>
        exit.call((s) => {
          addExitClass(s, tDuration).on('end.Remove', function() {
            if (!select(this).classed('exit-done')) return
            exit.remove().call((s) => seriesS.dispatch('exit', {detail: {selection: s}}))
          })
        }))
    .each((line, i, g) => pathLine(g[i], line.positions))
    .attr('data-style', (d) => d.styleClass)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesS.dispatch('update', {detail: {selection: s}}))
    .on('pointerover.serieslinehighlight pointerout.serieslinehighlight', (e: PointerEvent) =>
      (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
    )
}
