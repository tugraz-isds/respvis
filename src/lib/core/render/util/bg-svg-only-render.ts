import {Selection} from "d3";
import {backgroundSVGOnly} from "../../constants/dom/classes";
import {ignoreBounds} from "../../constants/dom/attributes";

type bgSVGOnlyData = {
  scale?: number
}
export function bgSVGOnlyRender<D extends bgSVGOnlyData>(parentS: Selection<SVGGraphicsElement>, data?: D[], refS?: Selection<SVGGraphicsElement>) {
  const { width, height, x, y } = (refS ? refS.node() : parentS.node())!.getBBox()
  return parentS.selectChildren<SVGRectElement, bgSVGOnlyData>(`.${backgroundSVGOnly}`)
    .data(data ?? [{} as bgSVGOnlyData])
    .join('rect')
    .classed(backgroundSVGOnly, true)
    .attr('x', d => Math.floor(d.scale ? x + ( width * (1 - d.scale) ) / 2 : x))
    .attr('y', d => Math.floor(d.scale ? y + ( height * (1 - d.scale) ) / 2 : y))
    .attr('width', d => Math.floor(d.scale ? width * d.scale : width)) //Math.floor(width)
    .attr('height', d => Math.floor(d.scale ? height * d.scale : height)) //Math.floor(height)
    .attr('fill', 'transparent') //transparent
    .attr('stroke', 'transparent')
    .attr('stroke-width', 0)
    .attr('data-ignore-layout', true)
    .attr(ignoreBounds, true)
}
