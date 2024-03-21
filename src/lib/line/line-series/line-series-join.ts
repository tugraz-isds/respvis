import {Selection} from "d3";
import {Line} from "./line";
import {pathLine} from "../../core";

export function lineSeriesJoin(seriesS: Selection<Element>, joinS: Selection<Element, Line>) {
  // todo: enter transition
  // todo: exit transition
  joinS
    .join(
      (enter) =>
        enter
          .append('path')
          .classed('line', true)
          .call((s) => seriesS.dispatch('enter', {detail: {selection: s}})),
      undefined,
      (exit) =>
        exit.remove().call((s) => seriesS.dispatch('exit', {detail: {selection: s}}))
    )
    .each((line, i, g) => pathLine(g[i], line.positions))
    .attr('data-style', (d) => d.styleClass)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesS.dispatch('update', {detail: {selection: s}}))
    .on('pointerover.serieslinehighlight pointerout.serieslinehighlight', (e: PointerEvent) =>
      (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
    )
}
