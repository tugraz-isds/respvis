import {Selection} from 'd3';
import {ChartData} from "./validate-chart";
import {elementFromSelection} from "../../../utilities/d3/util";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";
import {renderBgSVGOnlyFixed} from "../../util/bg-svg-only";
import {rectFromString} from "../../../utilities/graphic-elements/rect";
import {AxisOrientation, isCSSBreakpointLengthValue, SVGGroupingElement} from "../../../constants/types";
import {uniqueId} from "../../../utilities/unique";
import {cssLengthInPx} from "../../../utilities/dom/units";
import {updateBreakpointStateForSelection} from "../../../data";

export type ChartBaseSelection<T extends SVGGroupingElement, D extends ChartData> = Selection<T, D>;

export function renderChart<T extends SVGGroupingElement, D extends ChartData>(chartS: Selection<T, D>) {
  updateBreakpointStateForSelection(chartS)

  chartS.classed('chart', true)
    .classed('layout-container', true)
    .attr('xmlns', 'http://www.w3.org/2000/svg')

  const paddingWrapperS = renderPaddingWrapper(chartS)
  const {drawArea, ...restDrawArea} = renderDrawArea(paddingWrapperS)

  const header = renderHeader(chartS)
  const title = renderTitle(header, chartS)
  const subTitle = renderSubtitle(header, chartS)

  return {chartS, paddingWrapperS, header, title, subTitle, drawArea, ...restDrawArea}
}

function renderPaddingWrapper<T extends SVGGroupingElement, D extends ChartData>(chartS: ChartBaseSelection<T, D>) {
  return chartS
    .selectAll<SVGSVGElement, D>('.padding-wrapper')
    .data([chartS.datum()])
    .join('g')
    .classed('padding-wrapper', true)
}

function renderDrawArea<T extends SVGGroupingElement, D extends ChartData>(paddingS: ChartBaseSelection<T, D>) {
  const drawArea = paddingS
    .selectAll<SVGSVGElement, T>('.draw-area')
    .data([paddingS.datum()])
    .join('g')
    .classed('draw-area', true)
    .attr('data-ignore-layout-children', true)

  const boundsAttr = rectFromString(drawArea.attr('bounds') || '0, 0, 0, 0');
  const background = renderBgSVGOnlyFixed(drawArea, {...boundsAttr, x: 0, y: 0})
    .classed('background', true)

  const gridArea = drawArea.selectAll('.grid-area')
    .data([null])
    .join('g')
    .classed('grid-area', true)

  const orientations = ['left', 'top', 'right', 'bottom'] as const
  const containerSArr = orientations.map(orientation => renderPaddingContainers(paddingS, orientation))
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
  renderBgSVGOnlyFixed(drawAreaClipPath, clipPathRect)
  drawArea.attr('clip-path', `url(#${drawAreaClipPath.attr('id')})`)

  return {
    drawArea, background, gridArea, drawAreaClipPath,
    paddingContainerBottomS, paddingContainerTopS, paddingContainerRightS, paddingContainerLeftS
  }
}

function renderPaddingContainers<T extends SVGGroupingElement, D extends ChartData>
(paddingS: Selection<T, D>, orientation: AxisOrientation) {
  return paddingS
    .selectAll<SVGGElement, D>(`.padding-container--${orientation}`)
    .data([null])
    .join('g')
    .classed(`padding-container--${orientation}`, true)
}


function renderHeader(selection: Selection<SVGGroupingElement, ChartData>) {
  return selection
    .selectAll<SVGSVGElement, ChartData>('.header')
    .data((d) => [d])
    .join('g')
    .classed('header', true);
}

function renderTitle<T extends SVGGroupingElement, D extends ChartData>
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

function renderSubtitle<T extends SVGGroupingElement, D extends ChartData>
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
