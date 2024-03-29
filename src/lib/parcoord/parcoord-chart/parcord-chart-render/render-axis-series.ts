import {drag, select, Selection} from "d3";
import {ParcoordChartValid} from "../parcoord-chart-validation";
import {axisSequenceRender, AxisValid} from "../../../core";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {throttle} from "../../../core/utilities/d3/util";
import {onZoomAxisParcoord} from "./parcoord-chart-zoom-axis";
import {onDragAxisParcoord} from "./parcoord-chart-drag-axis";
import {parcoordChartAxisLimiterRender} from "./axis-limiter-render";
import {axisInverterRender} from "./axis-inverter-render";

export function renderAxisSeries(chartS: Selection<Element, ParcoordChartValid>) {
  const {series} = chartS.datum()
  const drawAreaS = chartS.selectAll('.draw-area')
  const drawAreaBackgroundS = drawAreaS.selectChild<SVGRectElement>('.background')

  const flipped = series.responsiveState.currentlyFlipped
  const axisPosition = flipped ? 'bottom' : 'left'

  const axisSeriesS = drawAreaS
    .selectAll<SVGGElement, AxisValid>(`.series-parcoord-axes`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-axes`, true)

  const boundsAttr = axisSeriesS.attr('bounds')
  if (!boundsAttr) return

  const filteredSeries = series.cloneFiltered().cloneZoomed().cloneInverted()
  const activeAxes = !series.keysActive[series.key] ? [] : filteredSeries.axes

  axisSeriesS
    .selectAll<SVGGElement, KeyedAxisValid>('.axis.axis-sequence')
    .data(activeAxes, (d) => d.key)
    .join('g')
    .each((d, i, g) => {
      // console.log(d.scaledValues.scale.range())
      const axisS = select<SVGGElement, KeyedAxisValid>(g[i])
      resetTickLines()
      axisSequenceRender(axisS, axisPosition)
      parcoordChartAxisLimiterRender(axisS, drawAreaBackgroundS, series)
      handleAxisZoomAndDrag()
      axisInverterRender(axisS)

      function resetTickLines() {
        const tickLinesS = axisS.selectAll('.tick > line');
        ['x1', 'x2', 'y1', 'y2']
          .forEach(attr => tickLinesS.attr(attr, null))
      }

      function handleAxisZoomAndDrag() {
        const throttledZoom = throttle((e) => onZoomAxisParcoord(e, d, series), 50)
        const throttledDrag = throttle((e) => onDragAxisParcoord(e, d, drawAreaBackgroundS, series), 50)
        const onZoom = (e) => {
          throttledZoom.func(e)
          if (e.sourceEvent.type === "mousemove" || e.sourceEvent.type === "touchmove") {
            throttledDrag.func(e)
          }
          if (e.sourceEvent.type === "wheel") {
            series.renderer.windowSelection.dispatch('resize')
          }
        }
        const zoomB = filteredSeries.zooms[i]
        if (!zoomB) {
          axisS.call(drag().on("drag.dragAxis", (e) => throttledDrag.func(e)))
          return
        }
        axisS.call(zoomB.behaviour.scaleExtent([zoomB.out, zoomB.in]).on('zoom.zoomAndDrag', onZoom))
      }
    })
    .attr('transform', (d, i) => {
      const percentage = filteredSeries.axesPercentageScale(activeAxes[i].key) ?? 0
      const x = flipped ? 0 : filteredSeries.percentageScreenScale(percentage)
      const y = flipped ? filteredSeries.percentageScreenScale(percentage) : 0
      return `translate(${x}, ${y})`
    })
    .each((d, i, g) => axisSeriesS.dispatch('enter', {
      detail: {selection: select(g[i])}
    }))
}
