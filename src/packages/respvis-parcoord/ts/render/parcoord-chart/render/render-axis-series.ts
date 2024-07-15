import {select, Selection} from "d3";
import {ParcoordChartData} from "../validate-parcoord-chart";
import {Axis, renderAxisSequence} from "respvis-core";
import {handleAxisZoomAndDrag} from "./parcoord-chart-zoom-axis";
import {renderAxisLimiter} from "./render-axis-limiter";
import {renderAxisInverter} from "./render-axis-inverter";
import {KeyedAxis} from "../../validate-keyed-axis";

export function renderAxisSeries(chartS: Selection<Element, ParcoordChartData>) {
  const {series, renderer} = chartS.datum()

  const axisSeriesS = axisSeriesRender()

  const filteredSeries = series.cloneFiltered().cloneZoomed().cloneInverted()

  axisSeriesS
    .selectAll<SVGGElement, KeyedAxis>('.axis.axis-sequence')
    .data(filteredSeries.axes, (d) => d.key.getRawKey())
    .join('g')
    .each((d, i, g) => {
      const axisS = select<SVGGElement, KeyedAxis>(g[i])
      const orientation = filteredSeries.responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
      renderAxisSequence(axisS, orientation)
      renderAxisLimiter(axisS)
      handleAxisZoomAndDrag(axisS, i)
      renderAxisInverter(axisS)
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
      .selectAll<SVGGElement, Axis>(`.series-parcoord-axes`)
      .data([series])
      .join('g')
      .classed(`series-parcoord-axes`, true)
  }
}


