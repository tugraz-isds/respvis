import {Selection} from 'd3';
import {ChartBaseValid} from "./chart-base-validation";
import {elementFromSelection} from "../../utilities/d3/util";
import {updateBoundStateInCSS} from "../../utilities/resizing/bounds";
import {getConfigBoundableState} from "../../utilities/resizing/boundable";

export type ChartBaseSelection = Selection<SVGSVGElement | SVGGElement, ChartBaseValid>;

export function chartBaseRender(selection: ChartBaseSelection): ChartBaseSelection {
  const chartElement = elementFromSelection(selection)
  const chartBaseValid = selection.data()[0]
  chartBaseValid.selection = selection
  updateBoundStateInCSS(chartElement, chartBaseValid.bounds)

  selection
    .classed('chart', true)
    .attr('xmlns', 'http://www.w3.org/2000/svg')

  selection
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
    .data((d) => [getConfigBoundableState(d.title, {chart: chartElement})])
    .join('g')
    .classed('title', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .text((d) => d);

  header
    .selectAll('.subtitle')
    .data((d) => [getConfigBoundableState(d.subTitle, {chart: chartElement})])
    .join('g')
    .classed('subtitle', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .text((d) => d);

  return selection
}
