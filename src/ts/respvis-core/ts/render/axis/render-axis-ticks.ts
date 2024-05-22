import {Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {AxisSelection} from "./render-axis";

export function renderAxisTicksPreGeneration(axisS: AxisSelection) {
  return axisS
    .selectAll('.ticks-transform')
    .data([null])
    .join('g')
    .classed('ticks-transform', true)
    .selectAll<SVGGElement, any>('.ticks')
    .data([null])
    .join('g')
    .classed('ticks', true)
    .attr('data-ignore-layout-children', true)
}

export function modifyAxisTicksPostGeneration(ticksS: Selection<SVGHTMLElement>) {
  ticksS
    .attr('fill', null)
    .attr('font-family', null)
    .attr('font-size', null)
    .attr('text-anchor', null)
    .selectAll<SVGGElement, string>('.tick')
    .attr('opacity', null)
    .attr('data-key', (d) => d)
    .selectAll('.pivot')
    .data([null])
    .join('g')
    .classed('pivot', true)
}
