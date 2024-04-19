import {select, Selection} from "d3";
import {Point, pointsCreate, pointSeriesJoin} from "../../point";
import {rectFromString} from "../../core";
import {LineSeries} from "./line-series-validation";
import {defaultStyleClass} from "../../core/constants/other";
import {seriesConfigTooltipsHandleEvents} from "../../tooltip";
import {Line} from "./line";
import {lineSeriesJoin} from "./line-series-join";
import {addHighlight} from "../../core/render/series/series-add-highlight";
import {labelSeriesFromElementsRender} from "../../core/render/label/todo/series-label";

export function lineSeriesRender(pointLineS: Selection<Element, LineSeries>): void {
  const series = pointLineS.datum()
  const pointGroups = pointsCreate(series, true)
  const pointGroupsFlat = pointGroups.flat()
  pointLineS.filter('.series-point-line')
    .call((s) => lineSeriesPointsRender(s, pointGroups))
    .call(addHighlight)
    .call(seriesConfigTooltipsHandleEvents)
    .call(() => labelSeriesFromElementsRender(series.renderer.drawAreaS, {
        elements: pointGroupsFlat,
        classes: ['series-label'],
        orientation: pointLineS.datum().responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
      }).attr( 'layout-strategy-horizontal', pointGroupsFlat[0]?.labelArg?.positionHorizontal ?? null)
        .attr( 'layout-strategy-vertical', pointGroupsFlat[0]?.labelArg?.positionVertical ?? null)
    )
  lineSeriesLinesRender(pointLineS.filter('.series-line'), pointGroups)
}

function lineSeriesPointsRender(pointS: Selection<Element, LineSeries>, pointGroups: Point[][]) {
  if (!pointS.attr('bounds')) return
  pointS.selectAll('.point-category')
    .data(pointGroups)
    .join('g')
    .classed('point-category', true)
    .each(function (d, i, g) {
      select(g[i]).selectAll<SVGCircleElement, Point>('.point')
        .data(pointGroups[i], (d) => d.key)
        .call((s) => pointSeriesJoin(pointS, s))
    })
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
