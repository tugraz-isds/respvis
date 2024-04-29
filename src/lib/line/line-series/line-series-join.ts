import {Selection} from "d3";
import {Line} from "./line";
import {pathLine} from "../../core";
import {addEnterClass, addExitClass} from "../../core/utilities/d3/transition";
import {cssVarFromSelection} from "../../core/utilities/d3/util";

export function lineSeriesJoin(seriesS: Selection<Element>, joinS: Selection<Element, Line>) {
  const tDurationString = cssVarFromSelection(seriesS, '--transition-time-line-enter-ms')
  const tDuration = tDurationString ? parseInt(tDurationString) : 250
  joinS
    .join(
      (enter) =>
        enter.append('path')
          .classed('line animated', true)
          .call(s => addEnterClass(s, tDuration))
          .call((s) => seriesS.dispatch('enter', {detail: {selection: s}})),
      undefined,
      (exit) =>
        exit.call((s) => addExitClass(s, tDuration).on('end', () => {
          exit.remove().call((s) => seriesS.dispatch('exit', {detail: {selection: s}}))
        })))
    .each((line, i, g) => pathLine(g[i], line.positions))
    .attr('data-style', (d) => d.styleClass)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesS.dispatch('update', {detail: {selection: s}}))
    .on('pointerover.serieslinehighlight pointerout.serieslinehighlight', (e: PointerEvent) =>
      (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
    )
}
