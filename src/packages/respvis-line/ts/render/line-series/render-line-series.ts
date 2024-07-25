import {Selection} from "d3";
import {createPoints, joinPointSeries, Point} from "respvis-point";
import {LineSeries} from "./line-series";
import {combineKeys, createSelectionClasses, defaultStyleClass, SVGGroupingElement} from "respvis-core";
import {Line} from "./line";
import {joinLineSeries} from "./join-line-series";

export function renderLineSeries(parentS: Selection<SVGGroupingElement>, series: LineSeries[], ...classes: string[]) {
  const {classString, selector} = createSelectionClasses(classes)
  const seriesS = parentS
    .selectAll<SVGGElement, LineSeries>(`${selector}.series-line`)
    .data(series)
    .join('g')
    .classed(`${classString} series-line`, true)
    .attr('data-ignore-layout-children', true)

  const createSelection = (type: 'line-line' | 'line-point') => {
    return seriesS
      .selectAll<SVGGElement, LineSeries>(`.series-${type}`)
      .data<LineSeries>(d => [d])
      .join('g')
      .classed(`series-${type}`, true)
  }

  seriesS.each(function(d) {
    const lineS = createSelection('line-line')
    const pointS = createSelection('line-point')
    const pointGroups = createPoints(d, true)
    renderPointSubSeries(pointS, pointGroups)
    renderLineSubSeries(lineS, pointGroups)
  })

  const lineSeriesS = seriesS.selectAll<SVGSVGElement, LineSeries>('.series-line-line')
  const lineS = lineSeriesS.selectAll<SVGSVGElement, Line>('.line')
  const pointSeriesS = seriesS.selectAll<SVGSVGElement, LineSeries>('.series-line-point')
  const pointS = pointSeriesS.selectAll<SVGSVGElement, Point>('.point')

  return { seriesS, lineSeriesS, lineS, pointSeriesS, pointS}
}

function renderPointSubSeries(pointS: Selection<SVGGElement, LineSeries>, pointGroups: Point[][]) {
  pointS.selectAll('.point-category')
    .data(pointGroups)
    .join('g')
    .classed('point-category', true)
    .selectAll<SVGCircleElement, Point>('.point')
    .data(d => d, d => d.key.rawKey)
    .call((s) => joinPointSeries(pointS, s))
}

function renderLineSubSeries(seriesS: Selection<SVGGElement, LineSeries>, pointGroups: Point[][]) {
  const renderData = seriesS.datum().renderData
  const categoryKeys = renderData.getMergedKeys()
  const keySelectors = categoryKeys.length > 0 ?
    categoryKeys.map(key => combineKeys([renderData.key, key])) : [renderData.key]

  const lines: Line[] = keySelectors.map((key, i) => ({
    key,
    positions: pointGroups[i].map(point => point.center),
    styleClass: pointGroups[i][0]?.styleClass ?? defaultStyleClass
  })).filter(line => line.positions.length !== 0)

  seriesS.selectAll<SVGPathElement, Line>('path')
    .data(lines, (d) => d.key)
    .call(s => joinLineSeries(seriesS, s))
}
