import {Selection} from "d3";
import {backgroundSVGOnly} from "../../constants/dom/classes";
import {ignoreBounds} from "../../constants/dom/attributes";

export function backgroundSVGOnlyRender<D>(parentS: Selection<SVGGraphicsElement>, data?: D[]) {
  const { width, height, x, y } = parentS.node()!.getBBox()
  return parentS.selectAll(`.${backgroundSVGOnly}`)
    .data(data ?? [null])
    .join('rect')
    .classed(backgroundSVGOnly, true)
    .attr('x', Math.floor(x))
    .attr('y', Math.floor(y))
    .attr('width', Math.floor(width))
    .attr('height', Math.floor(height))
    .attr('fill', 'transparent')
    .attr('stroke', 'transparent')
    .attr('stroke-width', 0)
    .attr('data-ignore-layout', true)
    .attr(ignoreBounds, true)
}
