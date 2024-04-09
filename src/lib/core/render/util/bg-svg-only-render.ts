import {Selection} from "d3";
import {backgroundSVGOnly} from "../../constants/dom/classes";

type bgSVGOnlyData = {
  scale?: number
  offsetX?: number
  offsetY?: number
}
export function bgSVGOnlyRender<D extends bgSVGOnlyData>(parentS: Selection<SVGGraphicsElement>, data?: D[], refS?: Selection<SVGGraphicsElement>) {
  const backgroundS = parentS.selectChildren<SVGRectElement, bgSVGOnlyData>(`.${backgroundSVGOnly}`)
    .data(data ?? [{} as bgSVGOnlyData])
    .join('rect')
    .classed(backgroundSVGOnly, true)
    .attr('fill', 'transparent') //transparent
    .attr('stroke', 'transparent')
    .attr('stroke-width', 0)
    .attr('data-ignore-layout', true)
    .attr('x', 0) //reset dimensions to not influence BBox()
    .attr('y', 0)
    .attr('width', 0)
    .attr('height', 0)

  const { width, height, x, y } = (refS ? refS.node() : parentS.node())!.getBBox()

  return backgroundS.attr('x', d =>
    Math.floor(d.scale ? x + ( width * (1 - d.scale) ) / 2 : x) + (d.offsetX ?? 0))
    .attr('y', d => Math.floor(d.scale ? y + ( height * (1 - d.scale) ) / 2 : y) + (d.offsetY ?? 0))
    .attr('width', d => Math.floor(d.scale ? width * d.scale : width))
    .attr('height', d => Math.floor(d.scale ? height * d.scale : height))
}

type bgSVGOnlyFixedData = {
  x: number
  y: number
  width: number
  height: number
}
export function bgSVGOnlyFixedRender(parentS: Selection<SVGGraphicsElement>, props: bgSVGOnlyFixedData) {
  return parentS.selectChildren<SVGRectElement, bgSVGOnlyData>(`.${backgroundSVGOnly}`)
    .data([props])
    .join('rect')
    .classed(backgroundSVGOnly, true)
    .attr('fill', 'transparent') //transparent
    .attr('stroke', 'transparent')
    .attr('stroke-width', 0)
    .attr('data-ignore-layout', true)
    .attr('x', d => d.x) //reset dimensions to not influence BBox()
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
}
