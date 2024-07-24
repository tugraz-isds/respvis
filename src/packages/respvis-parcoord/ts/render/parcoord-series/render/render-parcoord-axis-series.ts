import {select, Selection} from "d3";
import {renderAxisSequence} from "respvis-core";
import {handleAxisZoomAndDrag} from "./parcoord-chart-zoom-axis";
import {renderAxisLimiter} from "./render-axis-limiter";
import {renderAxisInverter} from "./render-axis-inverter";
import {KeyedAxis} from "../../validate-keyed-axis";
import {ParcoordSeries} from "respvis-parcoord";

export function renderParcoordAxisSeries(seriesS: Selection<Element, ParcoordSeries>) {
  seriesS
    .selectAll<SVGGElement, KeyedAxis>('.axis.axis-sequence')
    .data(d => d.renderData.axes, (d) => d.key)
    .join('g')
    .each((d, i, g) => {
      const axisS = select<SVGGElement, KeyedAxis>(g[i])
      const orientation = d.series.responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
      renderAxisSequence(axisS, orientation)
      renderAxisLimiter(axisS)
      handleAxisZoomAndDrag(axisS, i)
      renderAxisInverter(axisS)
    })
    .attr('transform', (d, i) => {
      const {x, y} = d.series.responsiveState.getAxisPosition(d.key)
      return `translate(${x}, ${y})`
    })
    .each((d, i, g) => seriesS.dispatch('enter', {
      detail: {selection: select(g[i])}
    }))
}
