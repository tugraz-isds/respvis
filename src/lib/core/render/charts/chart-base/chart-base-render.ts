import {Selection} from 'd3';
import {ChartBaseValid} from "./chart-base-validation";
import {elementFromSelection} from "../../../utilities/d3/util";
import {updateCSSForSelection} from "../../../data/breakpoint/breakpoint";
import {ScatterPlotValid} from "../../../../points";
import {SVGHTMLElement} from "../../../constants/types";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";


type ChartBaseElement = SVGSVGElement | SVGGElement
export type ChartBaseSelection<T extends ChartBaseElement, D extends ChartBaseValid> = Selection<T, D>;

export function chartBaseRender<T extends ChartBaseElement, D extends ChartBaseValid>(chartS: ChartBaseSelection<T, D>) {
  updateCSSForSelection(chartS)

  chartS.classed('chart', true)
    .attr('xmlns', 'http://www.w3.org/2000/svg')

  const paddingWrapperS = paddingWrapperRender(chartS)
  const {drawArea, background} = drawAreaRender(paddingWrapperS)
  const header = headerRender(chartS)
  const title = titleRender(header, chartS)
  const subTitle = subTitleRender(header, chartS)

  const data = chartS.datum()
  data.renderer.chartSelection = chartS
  data.renderer.drawAreaSelection = drawArea

  return {chartS, paddingWrapperS, header, title, subTitle, drawArea, background}
}

function paddingWrapperRender<T extends ChartBaseElement, D extends ChartBaseValid>(chartS: ChartBaseSelection<T, D>) {
  return chartS
    .selectAll<SVGSVGElement, D>('.padding-wrapper')
    .data([chartS.datum()])
    .join('svg')
    .classed('padding-wrapper', true)
}


function drawAreaRender<T extends ChartBaseElement, D extends ChartBaseValid>(paddingS: ChartBaseSelection<T, D>) {
  const drawArea = paddingS
    .selectAll<SVGHTMLElement, T>('.draw-area')
    .data([paddingS.datum()])
    .join('svg')
    .classed('draw-area', true)

  const background = drawArea
    .selectAll<SVGHTMLElement, T>('.background')
    .data([paddingS.datum()])
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
