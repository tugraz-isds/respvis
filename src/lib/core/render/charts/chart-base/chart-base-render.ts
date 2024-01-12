import {Selection} from 'd3';
import {ChartBaseValid} from "./chart-base-validation";
import {elementFromSelection} from "../../../utilities/d3/util";
import {updateCSSForSelection} from "../../../data/resizing/bounds";
import {getConfigBoundableState} from "../../../data/resizing/boundable";
import {ChartPointData} from "../../../../points";

export type ChartBaseSelection = Selection<SVGSVGElement | SVGGElement, ChartBaseValid>;

export function chartBaseRender<T extends ChartBaseSelection>(selection: T) {
  const data = selection.datum()
  data.renderer.chartSelection = selection
  addSelectionToData(selection)
  updateCSSForSelection(selection)

  chartRender(selection).call(drawAreaRender)

  const header = headerRender(selection)
  const title = titleRender(header, selection);
  const subTitle = subTitleRender(header, selection);

  return {chart: selection, header, title, subTitle}
}

function addSelectionToData(selection: Selection<SVGSVGElement | SVGGElement, ChartBaseValid>) {
  const chartBaseValid = selection.data()[0]
  chartBaseValid.selection = selection
}

function chartRender(selection: ChartBaseSelection): ChartBaseSelection {
  return selection
    .classed('chart', true)
    .attr('xmlns', 'http://www.w3.org/2000/svg')
}

function drawAreaRender(selection: Selection<SVGSVGElement | SVGGElement, ChartBaseValid>) {
  selection
    .selectAll('.draw-area')
    .data([null])
    .join('svg')
    .classed('draw-area', true)
    .selectAll('.background')
    .data([null])
    .join('rect')
    .classed('background', true);
}

function headerRender(selection: Selection<SVGSVGElement | SVGGElement, ChartBaseValid>) {
  return selection
    .selectAll<SVGSVGElement, ChartPointData>('.header')
    .data((d) => [d])
    .join('g')
    .classed('header', true);
}

function titleRender(header: ChartBaseSelection, chart: ChartBaseSelection){
  const chartElement = elementFromSelection(chart)
   return header
    .selectAll('.title')
    .data((d) => [getConfigBoundableState(d.title, {chart: chartElement})])
    .join('g')
    .classed('title', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .text((d) => d);
}

function subTitleRender(header: ChartBaseSelection, chart: ChartBaseSelection) {
  const chartElement = elementFromSelection(chart)
  return header
    .selectAll('.subtitle')
    .data((d) => [getConfigBoundableState(d.subTitle, {chart: chartElement})])
    .join('g')
    .classed('subtitle', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .text((d) => d);
}
