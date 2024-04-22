import {Selection} from 'd3';
import {ChartValid} from "./chart-validation";
import {elementFromSelection} from "../../../utilities/d3/util";
import {updateCSSForSelection} from "../../../data/breakpoint/breakpoint";
import {ScatterPlotValid} from "../../../../point";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";
import {bgSVGOnlyFixedRender} from "../../util/bg-svg-only-render";
import {rectFromString} from "../../../utilities/graphic-elements/rect";


type ChartBaseElement = SVGSVGElement | SVGGElement
export type ChartBaseSelection<T extends ChartBaseElement, D extends ChartValid> = Selection<T, D>;

export function chartRender<T extends ChartBaseElement, D extends ChartValid>(chartS: ChartBaseSelection<T, D>) {
  updateCSSForSelection(chartS)

  chartS.classed('chart', true)
    .attr('xmlns', 'http://www.w3.org/2000/svg')

  const paddingWrapperS = paddingWrapperRender(chartS)
  const {drawArea, background} = drawAreaRender(paddingWrapperS)
  const header = headerRender(chartS)
  const title = titleRender(header, chartS)
  const subTitle = subTitleRender(header, chartS)

  return {chartS, paddingWrapperS, header, title, subTitle, drawArea, background}
}

function paddingWrapperRender<T extends ChartBaseElement, D extends ChartValid>(chartS: ChartBaseSelection<T, D>) {
  return chartS
    .selectAll<SVGSVGElement, D>('.padding-wrapper')
    .data([chartS.datum()])
    .join('g')
    .classed('padding-wrapper', true)
}


function drawAreaRender<T extends ChartBaseElement, D extends ChartValid>(paddingS: ChartBaseSelection<T, D>) {
  const drawArea = paddingS
    .selectAll<SVGSVGElement, T>('.draw-area')
    .data([paddingS.datum()])
    .join('g')
    .classed('draw-area', true)
    .attr('data-ignore-layout-children', true)

  const boundsAttr = rectFromString(drawArea.attr('bounds') || '0 0 0 0');
  const background = bgSVGOnlyFixedRender(drawArea, {...boundsAttr, x: 0, y:0})
    .classed('background', true)
  return {drawArea, background}
}

function headerRender(selection: Selection<SVGSVGElement | SVGGElement, ChartValid>) {
  return selection
    .selectAll<SVGSVGElement, ScatterPlotValid>('.header')
    .data((d) => [d])
    .join('g')
    .classed('header', true);
}

function titleRender<T extends ChartBaseElement, D extends ChartValid>
(header: ChartBaseSelection<T, D>, chart: ChartBaseSelection<T, D>){
  const chartElement = elementFromSelection(chart)
   return header
    .selectAll('.title')
    .data((d) => [getCurrentRespVal(d.title, {chart: chartElement})])
    .join('g')
    .classed('title', true)
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .text((d) => d);
}

function subTitleRender<T extends ChartBaseElement, D extends ChartValid>
(header: ChartBaseSelection<T, D>, chart: ChartBaseSelection<T, D>){
  const chartElement = elementFromSelection(chart)
  return header
    .selectAll('.subtitle')
    .data((d) => [getCurrentRespVal(d.subTitle, {chart: chartElement})])
    .join('g')
    .classed('subtitle', true)
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .text((d) => d);
}
