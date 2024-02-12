import {axisSequenceRender, AxisValid, chartRender, Position} from "../../core";
import {select, Selection} from "d3";
import {ParcoordChartValid} from "./parcoord-chart-validation";
import {Line, lineSeriesJoin} from "../../line";
import {KeyedAxisValid} from "../../core/render/axis/keyed-axis-validation";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {combineKeys} from "../../core/utilities/dom/key";
import {defaultStyleClass} from "../../core/constants/other";

export type ParcoordChartSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ParcoordChartValid>;

export function parCoordChartRender(selection: ParcoordChartSVGChartSelection) {
  chartRender(selection).chartS
    .classed('chart-parcoord', true)
    .call(renderLineSeries)
    .call(renderAxisSeries)
}

function renderLineSeries(chartS: Selection<Element, ParcoordChartValid>) {
  const {series} = chartS.datum()

  const lineSeriesS = chartS.selectAll('.draw-area')
    .selectAll<SVGGElement, AxisValid>(`.series-parcoord-lines`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-lines`, true)
    .attr('data-ignore-layout-children', true)

  if (!lineSeriesS.attr('bounds') || !series.axes[0]) return

  const activeAxes = series.axes.filter(axis => {
    return series.keysActive[axis.key]
  }).map(axis => {
    return {...axis, scaledValues: axis.scaledValues.cloneFiltered()}
  })

  series.axesScale.domain(activeAxes.map(axis => axis.key))

  const lines: Line[] = []
  for (let valueIndex = 0; valueIndex < activeAxes[0].scaledValues.values.length; valueIndex++) {
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
      positions.push({
        y: vals.getScaledValue(valueIndex) + yBandWidth,
        x: series.axesScale(activeAxes[axisIndex].key)!
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

function renderAxisSeries(chartS: Selection<Element, ParcoordChartValid>) {
  const {series} = chartS.datum()

  const axisSeriesS = chartS.selectAll('.draw-area')
    .selectAll<SVGGElement, AxisValid>(`.series-parcoord-axes`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-axes`, true)

  const boundsAttr = axisSeriesS.attr('bounds')
  if (!boundsAttr) return

  const activeAxes = !series.keysActive[series.key] ? [] :
    series.axes.filter(axis => {
      return series.keysActive[axis.key]
    })

  axisSeriesS
    .selectAll<SVGGElement, KeyedAxisValid>('.axis.axis-sequence')
    .data(activeAxes, (d) => d.key)
    .join('g')
    .each((d, i, g) => axisSequenceRender(select(g[i])))
    .attr('transform', (d, i) => {
      const x = series.axesScale(activeAxes[i].key) ?? 0
      return `translate(${x}, ${0})`
    })
    .each((d, i, g) => axisSeriesS.dispatch('enter', {
      detail: {selection: select(g[i])}
    }))
}
