import {select, Selection} from "d3";
import {createPoints, joinPointSeries, Point} from "respvis-point";
import {LineSeries} from "./line-series-validation";
import {combineKeys, createSelectionClasses, defaultStyleClass} from "respvis-core";
import {Line} from "./line";
import {joinLineSeries} from "./join-line-series";

export function renderLineSeries(parentS: Selection<Element>, series: LineSeries, ...classes: string[]) {
  const {classString, selector} = createSelectionClasses(classes)
  const createSelection = (type: 'line-line' | 'line-point') => {
    return parentS
      .selectAll<SVGSVGElement, LineSeries>(`${selector}.series-line`)
      .data([null])
      .join('g')
      .classed(`${classString} series-line`, true)
      .selectAll<SVGSVGElement, LineSeries>(`.series-${type}`)
      .data<LineSeries>([series])
      .join('g')
      .classed(`series-${type}`, true)
      .attr('data-ignore-layout-children', true)
  }

  const lineS = createSelection('line-line')
  const pointS = createSelection('line-point')
  const pointGroups = createPoints(series, true)
  renderLineSeriesPoints(pointS, pointGroups)
  renderLineSeriesLines(lineS, pointGroups)
  return parentS.selectAll<SVGSVGElement, LineSeries>('.series-line-line , .series-line-point')
}

function renderLineSeriesPoints(pointS: Selection<Element, LineSeries>, pointGroups: Point[][]) {
  pointS.selectAll('.point-category')
    .data(pointGroups)
    .join('g')
    .classed('point-category', true)
    .each(function (d, i, g) {
      select(g[i]).selectAll<SVGCircleElement, Point>('.point')
        .data(pointGroups[i], (d) => d.key.rawKey)
        .call((s) => joinPointSeries(pointS, s))
    })
}

function renderLineSeriesLines(lineS: Selection<Element, LineSeries>, pointGroups: Point[][]) {
  const lineSeries = lineS.datum()
  const categoryKeys = lineSeries.getMergedKeys()
  const keySelectors = categoryKeys.length > 0 ?
    categoryKeys.map(key => combineKeys([lineSeries.key, key])) : [lineSeries.key]

  const lines: Line[] = keySelectors.map((key, i) => ({
    key,
    positions: pointGroups[i].map(point => point.center),
    styleClass: pointGroups[i][0]?.styleClass ?? defaultStyleClass
  })).filter(line => line.positions.length !== 0)

  lineS.selectAll<SVGPathElement, Line>('path')
    .data(lines, (d) => d.key)
    .call(s => joinLineSeries(lineS, s))
}
