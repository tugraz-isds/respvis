import {Selection} from "d3";
import {createSelectionClasses, SVGGroupingElement} from "respvis-core";
import {Line, LineSeries} from "respvis-line";
import {ParcoordSeries} from "respvis-parcoord";
import {renderParcoordLineSeries} from "./render-line-series";
import {renderParcoordAxisSeries} from "./render-parcoord-axis-series";

export function renderParcoordSeries(parentS: Selection<SVGGroupingElement>, series: ParcoordSeries[], ...classes: string[]) {
  const {classString, selector} = createSelectionClasses(classes)
  const seriesS = parentS
    .selectAll<SVGSVGElement, LineSeries>(`${selector}.series-parcoord`)
    .data(series)
    .join('g')
    .classed(`${classString} series-parcoord`, true)
    .attr('data-ignore-layout-children', true)

  const createSelection = (type: 'parcoord-line' | 'parcoord-axis') => {
    return seriesS
      .selectAll<SVGSVGElement, ParcoordSeries>(`.series-${type}`)
      .data(d => [d])
      .join('g')
      .classed(`series-${type}`, true)
  }

  seriesS.each(function(d) {
    const lineS = createSelection('parcoord-line')
    const axisS = createSelection('parcoord-axis')
    renderParcoordLineSeries(lineS)
    renderParcoordAxisSeries(axisS)
  })

  const lineSeriesS = seriesS.selectAll<SVGSVGElement, ParcoordSeries>('.series-parcoord-line')
  const lineS = lineSeriesS.selectAll<SVGSVGElement, Line>('.line')
  const axisSeriesS = seriesS.selectAll<SVGSVGElement, ParcoordSeries>('.series-parcoord-axis')
  const axisS = axisSeriesS.selectAll<SVGSVGElement, Line>('.axis')

  return { seriesS, lineSeriesS, lineS, axisSeriesS, axisS}
}
