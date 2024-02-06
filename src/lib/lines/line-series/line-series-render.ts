import {Selection} from "d3";
import {Point, seriesPointCreatePoints, seriesPointJoin} from "../../points";
import {pathLine, rectFromString} from "../../core";
import {LineSeries} from "./line-series-validation";
import {defaultStyleClass} from "../../core/constants/other";
import {seriesConfigTooltipsHandleEvents} from "../../tooltip";
import {Line} from "./line";

export function lineSeriesRender(pointLineS: Selection<Element, LineSeries>): void {
  const pointGroups = seriesPointCreatePoints(pointLineS.datum(), true)
  lineSeriesPointsRender(pointLineS.filter('.series-point-line'), pointGroups)
  lineSeriesLinesRender(pointLineS.filter('.series-line'), pointGroups)
}

function lineSeriesPointsRender(pointS: Selection<Element, LineSeries>, pointGroups: Point[][]) {
  if (!pointS.attr('bounds')) return
  pointS.selectAll<SVGCircleElement, Point>('.point')
    .data(pointGroups.flat(), (d) => d.key)
    .call((s) => seriesPointJoin(pointS, s))
  pointS.on('pointerover.seriespointhighlight pointerout.seriespointhighlight', (e: PointerEvent) =>
    (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
  ).call((s) => seriesConfigTooltipsHandleEvents(s))
}

function lineSeriesLinesRender(lineS: Selection<Element, LineSeries>, pointGroups: Point[][]) {
  const boundsAttr = lineS.attr('bounds')
  if (!boundsAttr) return
  lineS.datum().bounds = rectFromString(boundsAttr)
  const lineSeries = lineS.datum()
  const keySelectors = lineSeries.getMergedKeys()
  const lines: Line[] = keySelectors.map((key, i) => ({
    key,
    positions: pointGroups[i].map(point => point.center),
    styleClass: pointGroups[i][0]?.styleClass ?? defaultStyleClass
  })).filter(line => line.positions.length !== 0)

  lineS.selectAll<SVGPathElement, Line>('path')
    .data(lines, (d) => d.key)
    .call(s => lineSeriesJoin(lineS, s))
}

function lineSeriesJoin(seriesS: Selection<Element>, joinS: Selection<Element, Line>) {
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

