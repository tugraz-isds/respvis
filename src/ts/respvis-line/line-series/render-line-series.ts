import {select, Selection} from "d3";
import {createPoints, joinPointSeries, Point} from "respvis-point";
import {LineSeries} from "./line-series-validation";
import {addSeriesHighlighting, defaultStyleClass, renderLabelSeries} from "respvis-core";
import {seriesConfigTooltipsHandleEvents} from "respvis-tooltip";
import {Line} from "./line";
import {joinLineSeries} from "./join-line-series";

export function renderLineSeries(pointLineS: Selection<Element, LineSeries>): void {
  const series = pointLineS.datum()
  const pointGroups = createPoints(series, true)
  const pointGroupsFlat = pointGroups.flat()
  pointLineS.filter('.series-point-line')
    .call((s) => renderLineSeriesPoints(s, pointGroups))
    .call(addSeriesHighlighting)
    .call(seriesConfigTooltipsHandleEvents)
    .call(() => renderLabelSeries(series.renderer.drawAreaS, {
        elements: pointGroupsFlat,
        classes: ['series-label'],
        orientation: pointLineS.datum().responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
      }).attr( 'layout-strategy-horizontal', pointGroupsFlat[0]?.labelArg?.positionHorizontal ?? null)
        .attr( 'layout-strategy-vertical', pointGroupsFlat[0]?.labelArg?.positionVertical ?? null)
    )
  renderLineSeriesLines(pointLineS.filter('.series-line'), pointGroups)
}

function renderLineSeriesPoints(pointS: Selection<Element, LineSeries>, pointGroups: Point[][]) {
  pointS.selectAll('.point-category')
    .data(pointGroups)
    .join('g')
    .classed('point-category', true)
    .each(function (d, i, g) {
      select(g[i]).selectAll<SVGCircleElement, Point>('.point')
        .data(pointGroups[i], (d) => d.key)
        .call((s) => joinPointSeries(pointS, s))
    })
}

function renderLineSeriesLines(lineS: Selection<Element, LineSeries>, pointGroups: Point[][]) {
  const lineSeries = lineS.datum()
  const keySelectors = lineSeries.getMergedKeys()
  const lines: Line[] = keySelectors.map((key, i) => ({
    key,
    positions: pointGroups[i].map(point => point.center),
    styleClass: pointGroups[i][0]?.styleClass ?? defaultStyleClass
  })).filter(line => line.positions.length !== 0)

  lineS.selectAll<SVGPathElement, Line>('path')
    .data(lines, (d) => d.key)
    .call(s => joinLineSeries(lineS, s))
}
