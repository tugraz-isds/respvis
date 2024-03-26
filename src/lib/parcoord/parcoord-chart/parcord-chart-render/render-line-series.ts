import {Selection} from "d3";
import {ParcoordChartValid} from "../parcoord-chart-validation";
import {AxisValid, Position} from "../../../core";
import {Line, lineSeriesJoin} from "../../../line";
import {ScaledValuesCategorical} from "../../../core/data/scale/scaled-values-categorical";
import {combineKeys} from "../../../core/utilities/dom/key";
import {defaultStyleClass} from "../../../core/constants/other";

export function renderLineSeries(chartS: Selection<Element, ParcoordChartValid>) {
  const {series} = chartS.datum()

  const lineSeriesS = chartS.selectAll('.draw-area')
    .selectAll<SVGGElement, AxisValid>(`.series-parcoord-lines`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-lines`, true)
    .attr('data-ignore-layout-children', true)

  if (!lineSeriesS.attr('bounds')) return

  const filteredSeries = series.cloneFiltered().cloneZoomed()
  const activeAxes = filteredSeries.getAxesDragDropOrdered()

  const lines: Line[] = []
  const maxIndex = activeAxes.length > 0 ? activeAxes[0].scaledValues.values.length : 0
  for (let valueIndex = 0; valueIndex < maxIndex; valueIndex++) {
    if (!series.keysActive[series.key]) break
    if (series.categories && !series.categories.isKeyActiveByIndex(valueIndex)) continue
    const positions: Position[] = []
    let containsInactiveAxisCategory = false

    for (let axisIndex = 0; axisIndex < activeAxes.length; axisIndex++) {
      const axis = activeAxes[axisIndex]
      const vals = axis.scaledValues
      if (!vals.isKeyActiveByIndex(valueIndex)) {
        containsInactiveAxisCategory = true
        break
      }
      const yBandWidth = vals instanceof ScaledValuesCategorical ? vals.scale.bandwidth() / 2 : 0
      const xPercent = filteredSeries.axesPercentageScale(activeAxes[axisIndex].key)
      const xReal = filteredSeries.percentageScreenScale(xPercent)
      positions.push({
        y: vals.getScaledValue(valueIndex) + yBandWidth,
        x: xReal
      })
    }
    if (containsInactiveAxisCategory) continue

    lines.push({
      key: combineKeys([series.key, `i-${valueIndex}`]), //TODO
      styleClass: series.categories ? series.categories.categories.styleClassValues[valueIndex] : defaultStyleClass,
      positions
    })

  }

  lineSeriesS.selectAll<SVGPathElement, Line>('path')
    .data(lines, (d) => d.key)
    .call(s => lineSeriesJoin(lineSeriesS, s))
}
