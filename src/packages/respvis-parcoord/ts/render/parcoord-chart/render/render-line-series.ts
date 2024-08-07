import {Selection} from "d3";
import {ParcoordChartData} from "../validate-parcoord-chart";
import {Axis, combineKeys, defaultStyleClass, Position} from "respvis-core";
import {joinLineSeries, Line} from "respvis-line";
import {ParcoordSeries} from "../../parcoord-series";
import {KeyedAxis} from "../../validate-keyed-axis";

export function renderLineSeriesParcoord(chartS: Selection<Element, ParcoordChartData>) {
  const {series} = chartS.datum()
  const lineSeriesS = chartS.selectAll('.draw-area')
    .selectAll<SVGGElement, Axis>(`.series-parcoord-lines`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-lines`, true)

  const filteredSeries = series.cloneFiltered().cloneZoomed().cloneInverted()
  const activeAxes = filteredSeries.getAxesDragDropOrdered()
  const lines = activeAxes.length > 0 ? createLines(activeAxes) : []


  lineSeriesS.selectAll<SVGPathElement, Line>('path')
    .data(lines, (d) => d.key)
    .call(s => joinLineSeries(lineSeriesS, s))
}

function createLines(activeAxes: KeyedAxis[]) {
  const lines: Line[] = []
  const series = activeAxes[0].series
  const maxIndex = activeAxes[0].scaledValues.values.length
  if (!series.keysActive[series.key]) return lines

  for (let valueIndex = 0; valueIndex < maxIndex; valueIndex++) {
    if (series.categories && !series.categories.isValueActive(valueIndex)) continue
    const positions = createLinePositions(activeAxes, valueIndex, series)
    if (positions.length === 0) continue

    const categoryKey = series.categories?.getCombinedKey(valueIndex)

    lines.push({
      key: combineKeys([series.key, ...(categoryKey ? [categoryKey] : []), `i-${valueIndex}`]),
      styleClass: series.categories ? series.categories.getStyleClass(valueIndex) : defaultStyleClass,
      positions
    })
  }
  return lines
}

function createLinePositions(activeAxes: KeyedAxis[], valueIndex: number, series: ParcoordSeries) {
  const positions: Position[] = []
  const flipped = series.responsiveState.currentlyFlipped
  for (let axisIndex = 0; axisIndex < activeAxes.length; axisIndex++) {
    const axis = activeAxes[axisIndex]
    const valPos = axis.scaledValues.getScaledValue(valueIndex)
    if (!axis.scaledValues.isValueActive(valueIndex) || !axis.isValueInRangeLimit(valPos)) return []

    const axisPosPercent = series.originalSeries.axesPercentageScale(axis.key)
    const axisPosReal = series.percentageScreenScale(axisPosPercent)
    positions.push({
      y: flipped ? axisPosReal : valPos,
      x: flipped ? valPos : axisPosReal
    })
  }
  return positions
}
