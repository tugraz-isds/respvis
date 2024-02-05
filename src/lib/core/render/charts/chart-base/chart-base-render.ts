import {Selection} from 'd3';
import {ChartBaseValid} from "./chart-base-validation";
import {elementFromSelection} from "../../../utilities/d3/util";
import {updateCSSForSelection} from "../../../data/breakpoint/breakpoint";
import {ScatterPlotValid} from "../../../../points";
import {SVGHTMLElement} from "../../../constants/types";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";

export type ChartBaseSelection = Selection<SVGSVGElement | SVGGElement, ChartBaseValid>;

export function chartBaseRender<T extends ChartBaseSelection>(selection: T) {
  updateCSSForSelection(selection)

  const chart = chartRender(selection)
  const {drawArea, background} = drawAreaRender(chart)
  const header = headerRender(selection)
  const title = titleRender(header, selection)
  const subTitle = subTitleRender(header, selection)

  const data = selection.datum()
  data.renderer.chartSelection = chart
  data.renderer.drawAreaSelection = drawArea

  return {chart, header, title, subTitle, drawArea, background}
}

function chartRender<T extends ChartBaseSelection>(selection: T): T {
  return selection
    .classed('chart', true)
    .attr('xmlns', 'http://www.w3.org/2000/svg')
}
function drawAreaRender<T extends ChartBaseSelection>(selection: T) {
  const drawArea = selection
    .selectAll<SVGHTMLElement, T>('.draw-area')
    .data([selection.datum()])
    .join('svg')
    .classed('draw-area', true)

  const background = drawArea
    .selectAll<SVGHTMLElement, T>('.background')
    .data([selection.datum()])
    .join('rect')
    .classed('background', true)
  return {drawArea, background}
}

function headerRender(selection: Selection<SVGSVGElement | SVGGElement, ChartBaseValid>) {
  return selection
    .selectAll<SVGSVGElement, ScatterPlotValid>('.header')
    .data((d) => [d])
    .join('g')
    .classed('header', true);
}

function titleRender(header: ChartBaseSelection, chart: ChartBaseSelection){
  const chartElement = elementFromSelection(chart)
   return header
    .selectAll('.title')
    .data((d) => [getCurrentRespVal(d.title, {chart: chartElement})])
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
    .data((d) => [getCurrentRespVal(d.subTitle, {chart: chartElement})])
    .join('g')
    .classed('subtitle', true)
    .attr('data-ignore-layout-children', true)
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .text((d) => d);
}
