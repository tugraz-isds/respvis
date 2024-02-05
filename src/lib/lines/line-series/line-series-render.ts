import {Selection} from "d3";
import {Point, seriesPointCreatePoints, seriesPointJoin} from "../../points";
import {pathLine, rectFromString} from "../../core";
import {LineSeries} from "./line-series-validation";
import {mergeKeys} from "../../core/utilities/dom/key";
import {defaultStyleClass} from "../../core/constants/other";
import {seriesConfigTooltipsHandleEvents} from "../../tooltip";

export function lineSeriesRender(pointLineS: Selection<Element, LineSeries>): void {
  const lineSeries = pointLineS.datum()
  const pointGroups = seriesPointCreatePoints(lineSeries, true)

  const pointSelection = pointLineS.filter('.series-point-line')
  pointSelection.each((d, i, g) => {
    const boundsAttrPoints = pointSelection.attr('bounds')
    if (!boundsAttrPoints) return
    d.bounds = rectFromString(boundsAttrPoints)
    pointSelection.selectAll<SVGCircleElement, Point>('.point')
      .data(pointGroups.flat(), (d) => d.key)
      .call((s) => seriesPointJoin(pointSelection, s))
    pointSelection.on('pointerover.seriespointhighlight pointerout.seriespointhighlight', (e: PointerEvent) =>
      (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
    ).call((s) => seriesConfigTooltipsHandleEvents(s))
  })


  const getKeySelectors = () => {
    if (lineSeries.categories) {
      const parentKey = lineSeries.categories.parentKey
      return lineSeries.categories.categories.keyOrder.map(cKey =>
        mergeKeys([parentKey, cKey]))
    }
    return [lineSeries.key]
  }
  const keySelectors = getKeySelectors()
  const seriesInactive = lineSeries.keysActive[lineSeries.key] === false

  const lineSelection = pointLineS.filter('.series-line')
  lineSelection.each((d, i, g) => {
    const boundsAttr = lineSelection.attr('bounds')
    if (!boundsAttr) return
    keySelectors.forEach((key, i) => {
      renderLine(lineSelection, seriesInactive ? [] : pointGroups[i], key)
    })
  })
}

function renderLine(seriesS: Selection<Element>, points: Point[], key: string) {
  const pointsEmpty = points.length === 0
  seriesS
    .selectAll<SVGPathElement, Point[]>('path')
    .data(pointsEmpty ? [] : [points], () => key)
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
    .each((points, i, g) => {
      const positions = points.map(point => point.center)
      pathLine(g[i], positions);
    })
    .attr('data-style', (d) => d[0]?.styleClass ?? defaultStyleClass)
    .attr('data-key', (d) => key)
    .call((s) => seriesS.dispatch('update', {detail: {selection: s}}))
    .on('pointerover.serieslinehighlight pointerout.serieslinehighlight', (e: PointerEvent) =>
      (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
    );

}

