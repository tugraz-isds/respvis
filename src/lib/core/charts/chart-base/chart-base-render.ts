import {Selection} from 'd3';
import {IChartBaseData} from "./IChartBaseData";

export type ChartBaseSelection = Selection<SVGSVGElement | SVGGElement, IChartBaseData>;

export function chartBaseRender(selection: ChartBaseSelection): ChartBaseSelection {
  selection
    .classed('chart', true)
    .attr('xmlns', 'http://www.w3.org/2000/svg')

  selection
    .classed('chart-cartesian', true)
    .selectAll('.draw-area')
    .data([null])
    .join('svg')
    .classed('draw-area', true)
    .selectAll('.background')
    .data([null])
    .join('rect')
    .classed('background', true);

  const header = selection
    .selectAll('.header')
    .data((d) => [d])
    .join('g')
    .classed('header', true);

  header
    .selectAll('.title')
    .data((d) => [d.title ? d.title : ""])
    .join('g')
    .classed('title', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .text((d) => d);

  header
    .selectAll('.subtitle')
    .data((d) => [d.subtitle ? d.subtitle : ""])
    .join('g')
    .classed('subtitle', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .text((d) => d);

  return selection
}
