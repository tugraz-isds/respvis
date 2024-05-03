import {select, Selection} from "d3";
import {ParcoordChartValid} from "../parcoord-chart-validation";
import {axisSequenceRender, AxisValid} from "../../../core";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {handleAxisZoomAndDrag} from "./parcoord-chart-zoom-axis";
import {parcoordChartAxisLimiterRender} from "./axis-limiter-render";
import {axisInverterRender} from "./axis-inverter-render";

export function renderAxisSeries(chartS: Selection<Element, ParcoordChartValid>) {
  const {series, renderer} = chartS.datum()

  const axisSeriesS = axisSeriesRender()

  const filteredSeries = series.cloneFiltered().cloneZoomed().cloneInverted()

  axisSeriesS
    .selectAll<SVGGElement, KeyedAxisValid>('.axis.axis-sequence')
    .data(filteredSeries.axes, (d) => d.key)
    .join('g')
    .each((d, i, g) => {
      const axisS = select<SVGGElement, KeyedAxisValid>(g[i])
      const orientation = filteredSeries.responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
      axisSequenceRender(axisS, orientation)
      parcoordChartAxisLimiterRender(axisS)
      handleAxisZoomAndDrag(axisS, i)
      axisInverterRender(axisS)
    })
    .attr('transform', (d, i) => {
      const {x, y} = filteredSeries.responsiveState.getAxisPosition(i)
      return `translate(${x}, ${y})`
    })
    .each((d, i, g) => axisSeriesS.dispatch('enter', {
      detail: {selection: select(g[i])}
    }))

  function axisSeriesRender() {
    return renderer.drawAreaS
      .selectAll<SVGGElement, AxisValid>(`.series-parcoord-axes`)
      .data([series])
      .join('g')
      .classed(`series-parcoord-axes`, true)
  }
}


