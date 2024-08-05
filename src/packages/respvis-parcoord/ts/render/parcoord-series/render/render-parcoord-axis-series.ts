import {select, Selection} from "d3";
import {renderAxisSequence} from "respvis-core";
import {setUpAxisZoom} from "./set-up-axis-zoom";
import {renderAxisLimiter} from "./render-axis-limiter";
import {renderAxisInverter} from "./render-axis-inverter";
import {KeyedAxis} from "../../validate-keyed-axis";
import {ParcoordSeries} from "respvis-parcoord";
import {setUpAxisDrag} from "./set-up-axis-drag";
import {updateAxisCursorClasses} from "./update-axis-cursor-classes";

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
      setUpAxisDrag(axisS, i)
      setUpAxisZoom(axisS, i)
      renderAxisInverter(axisS)
      updateAxisCursorClasses(axisS)
    })
    .attr('transform', (d, i) => {
      const {x, y} = d.series.responsiveState.getAxisPosition(d.key)
      return `translate(${x}, ${y})`
    })
    .each((d, i, g) => seriesS.dispatch('enter', {
      detail: {selection: select(g[i])}
    }))
}
