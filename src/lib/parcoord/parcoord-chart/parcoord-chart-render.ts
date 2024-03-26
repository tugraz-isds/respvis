import {axisSequenceRender, AxisValid, chartRender, Position} from "../../core";
import {drag, select, Selection} from "d3";
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
  console.log(series.keysActive)

  const lineSeriesS = chartS.selectAll('.draw-area')
    .selectAll<SVGGElement, AxisValid>(`.series-parcoord-lines`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-lines`, true)
    .attr('data-ignore-layout-children', true)

  if (!lineSeriesS.attr('bounds') || !series.axes[0]) return

  const filteredSeries = series.cloneFiltered()
  const activeAxes = filteredSeries.getAxesDragDropOrdered()

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

function renderAxisSeries(chartS: Selection<Element, ParcoordChartValid>) {
  const {series} = chartS.datum()
  const drawAreaS = chartS.selectAll('.draw-area')
  const drawAreaBackgroundS = drawAreaS.selectChild('.background')

  const axisSeriesS = drawAreaS
    .selectAll<SVGGElement, AxisValid>(`.series-parcoord-axes`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-axes`, true)

  const boundsAttr = axisSeriesS.attr('bounds')
  if (!boundsAttr) return

  const filteredSeries = series.cloneFiltered()
  const activeAxes = !series.keysActive[series.key] ? [] : filteredSeries.axes

  axisSeriesS
    .selectAll<SVGGElement, KeyedAxisValid>('.axis.axis-sequence')
    .data(activeAxes, (d) => d.key)
    .join('g')
    .each((d, i, g) => {
      const axisS = select<SVGGElement, KeyedAxisValid>(g[i])
      axisSequenceRender(axisS)
      const dragB = drag()
      const onDrag = (e) => {
        const rect = (drawAreaBackgroundS.node() as Element)?.getBoundingClientRect();
        const event = e.sourceEvent
        if (!rect || !event) return
        let mouseX = event.x - rect.left
        mouseX = mouseX < 0 ? 0 : mouseX > rect.width ? rect.width : mouseX
        const percentX = mouseX / rect.width
        // console.log(e.clientX, rect.left, mouseX, percentX)
        // const mouseY = e.clientY - rect.top
        const oldPercentageDomain = series.axesPercentageScale.domain()
        const index = oldPercentageDomain.indexOf(d.key)
        const newPercentageRange = series.axesPercentageScale.range()
        // console.log(oldPercentageDomain, d.key, index, newPercentageRange)
        newPercentageRange[index] = percentX
        series.axesPercentageScale.range(newPercentageRange)
      }

      // const throttledDrag =
      axisS.call(dragB
        .on("drag", onDrag)
      )
    })
    .attr('transform', (d, i) => {
      const percentage = filteredSeries.axesPercentageScale(activeAxes[i].key) ?? 0
      const x = filteredSeries.percentageScreenScale(percentage)

      // const x = series.axesScale(activeAxes[i].key) ?? 0
      // console.log("AxisPercentage", filteredSeries.axesPercentageScale.domain(), filteredSeries.axesPercentageScale.range())
      // console.log("PercentageScreen", filteredSeries.percentageScreenScale.domain(), filteredSeries.percentageScreenScale.range())

      return `translate(${x}, ${0})`
    })
    .each((d, i, g) => axisSeriesS.dispatch('enter', {
      detail: {selection: select(g[i])}
    }))
}
