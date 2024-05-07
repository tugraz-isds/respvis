import {Selection} from 'd3';
import {ChartValid} from "./chart-validation";
import {elementFromSelection} from "../../../utilities/d3/util";
import {updateCSSForSelection} from "../../../data/breakpoint/breakpoint";
import {ScatterPlotValid} from "../../../../respvis-point";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";
import {bgSVGOnlyFixedRender} from "../../util/bg-svg-only-render";
import {rectFromString} from "../../../utilities/graphic-elements/rect";
import {AxisOrientation, isCSSBreakpointLengthValue, SVGGroupingElement} from "../../../constants/types";
import {uniqueId} from "../../../utilities/unique";
import {cssLengthInPx} from "../../../utilities/dom/units";

export type ChartBaseSelection<T extends SVGGroupingElement, D extends ChartValid> = Selection<T, D>;

export function chartRender<T extends SVGGroupingElement, D extends ChartValid>(chartS: Selection<T, D>) {
  updateCSSForSelection(chartS)

  chartS.classed('chart', true)
    .classed('layout-container', true)
    .attr('xmlns', 'http://www.w3.org/2000/svg')

  const paddingWrapperS = paddingWrapperRender(chartS)
  const {drawArea, ...restDrawArea} = drawAreaRender(paddingWrapperS)

  const header = headerRender(chartS)
  const title = titleRender(header, chartS)
  const subTitle = subTitleRender(header, chartS)

  return {chartS, paddingWrapperS, header, title, subTitle, drawArea, ...restDrawArea}
}

function paddingWrapperRender<T extends SVGGroupingElement, D extends ChartValid>(chartS: ChartBaseSelection<T, D>) {
  return chartS
    .selectAll<SVGSVGElement, D>('.padding-wrapper')
    .data([chartS.datum()])
    .join('g')
    .classed('padding-wrapper', true)
}

function drawAreaRender<T extends SVGGroupingElement, D extends ChartValid>(paddingS: ChartBaseSelection<T, D>) {
  const drawArea = paddingS
    .selectAll<SVGSVGElement, T>('.draw-area')
    .data([paddingS.datum()])
    .join('g')
    .classed('draw-area', true)
    .attr('data-ignore-layout-children', true)

  const boundsAttr = rectFromString(drawArea.attr('bounds') || '0, 0, 0, 0');
  const background = bgSVGOnlyFixedRender(drawArea, {...boundsAttr, x: 0, y: 0})
    .classed('background', true)

  const gridArea = drawArea.selectAll('.grid-area')
    .data([null])
    .join('g')
    .classed('grid-area', true)

  const orientations = ['left', 'top', 'right', 'bottom'] as const
  const containerSArr = orientations.map(orientation => paddingContainersRender(paddingS, orientation))
  const [paddingContainerBottomS, paddingContainerTopS, paddingContainerRightS, paddingContainerLeftS] = containerSArr
  const [paddingLeft, paddingTop, paddingRight, paddingBottom] = containerSArr.map((sel, index) => {
    const element = elementFromSelection(sel)
    const orientation = orientations[index]
    // const dim = (orientation === 'top' || orientation === 'bottom') ? 'height' : 'width' //maybe in future
    const val = getComputedStyle(element).getPropertyValue(`--chart-padding-${orientation}`)
    if (isCSSBreakpointLengthValue(val)) return cssLengthInPx(val, element)
    return 0
  })

  const drawAreaClipPath = drawArea.selectAll<SVGClipPathElement, null>('.draw-area__clip')
    .data([null])
    .join('clipPath')
    .classed('draw-area__clip', true)

  if (!drawAreaClipPath.attr('id')) drawAreaClipPath.attr('id', uniqueId())
  const clipPathRect = {
    x: -paddingLeft, y: -paddingTop,
    width: boundsAttr.width + paddingLeft + paddingRight,
    height: boundsAttr.height + paddingTop + paddingBottom
  }
  bgSVGOnlyFixedRender(drawAreaClipPath, clipPathRect)
  drawArea.attr('clip-path', `url(#${drawAreaClipPath.attr('id')})`)

  return {
    drawArea, background, gridArea, drawAreaClipPath,
    paddingContainerBottomS, paddingContainerTopS, paddingContainerRightS, paddingContainerLeftS
  }
}

function paddingContainersRender<T extends SVGGroupingElement, D extends ChartValid>
(paddingS: Selection<T, D>, orientation: AxisOrientation) {
  return paddingS
    .selectAll<SVGGElement, D>(`.padding-container--${orientation}`)
    .data([null])
    .join('g')
    .classed(`padding-container--${orientation}`, true)
}


function headerRender(selection: Selection<SVGGroupingElement, ChartValid>) {
  return selection
    .selectAll<SVGSVGElement, ScatterPlotValid>('.header')
    .data((d) => [d])
    .join('g')
    .classed('header', true);
}

function titleRender<T extends SVGGroupingElement, D extends ChartValid>
(header: Selection<any, D>, chart: Selection<T, D>) {
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

function subTitleRender<T extends SVGGroupingElement, D extends ChartValid>
(header: ChartBaseSelection<any, D>, chart: ChartBaseSelection<T, D>) {
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
