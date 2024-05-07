import {KeyedAxisValid} from "respvis-core/render/axis/keyed-axis-validation";
import {drag, Selection} from "d3";
import {pathChevronRender} from "../../../respvis-core";
import {bboxDiffSVG} from "respvis-core/utilities/position/diff";
import {cssVarFromSelection, throttle} from "respvis-core/utilities/d3/util";
import {relateDragWayToSelection, relateDragWayToSelectionByDiff} from "respvis-core/utilities/d3/drag";
import {bgSVGOnlyBBoxRender} from "respvis-core/render/util/bg-svg-only-render";
import {backgroundSVGOnly} from "respvis-core/constants/dom/classes";

export function parcoordChartAxisLimiterRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  slidersChevronRender(axisS)
  sliderRectRender(axisS)
  alignSliders(axisS)
  addSliderDrag(axisS)
}

function slidersChevronRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const flipped = axisS.datum().series.responsiveState.currentlyFlipped
  const direction = (flipped ? 'right' : 'down')
  const upperChevronS = pathChevronRender(axisS, ['slider-up'], [{type: direction, scale: 1.5}])
  bgSVGOnlyBBoxRender(upperChevronS, [{scale: 2}], upperChevronS.select('path'))
    .classed('cursor', true)
    .classed('cursor--range-vertical', !flipped)
    .classed('cursor--range-horizontal cursor--range-left', flipped)
  const lowerChevronS = pathChevronRender(axisS, ['slider-down'], [{type: direction, scale: 1.5}])
  bgSVGOnlyBBoxRender(lowerChevronS, [{scale: 2}], lowerChevronS.select('path'))
    .classed('cursor', true)
    .classed('cursor--range-horizontal ', flipped)
    .classed('cursor--range-vertical cursor--range-up', !flipped)
}

function sliderRectRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const flipped = axisS.datum().series.responsiveState.currentlyFlipped
  axisS.selectAll('.slider-rect')
    .data([null])
    .join('rect')
    .classed('slider-rect', true)
    .classed('cursor cursor--range-rect', true)
    .classed('cursor--range-rect-horizontal', flipped)
}

function alignSliders(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const {upperRangeLimitPercent, lowerRangeLimitPercent, scaledValues, series} = axisS.datum()
  const upperChevronS= axisS.selectAll<SVGGElement, any>('.slider-up')
  const lowerChevronS = axisS.selectAll<SVGGElement, any>('.slider-down')
  const sliderRectS = axisS.selectAll<SVGRectElement, any>('.slider-rect')
  const domainS = axisS.select<SVGPathElement>('.domain')
  const {leftCornersXDiff, leftCornersYDiff, bbox2: bboxPath, bbox1: bboxDomain} =
    bboxDiffSVG(domainS, upperChevronS.select('path'))
  
  if (series.responsiveState.currentlyFlipped) {
    const upperRange = scaledValues.getRangeByPercent(upperRangeLimitPercent, false, 'horizontal')
    const lowerRange = scaledValues.getRangeByPercent(lowerRangeLimitPercent, false, 'horizontal')

    const translateAlign = `translate(${-leftCornersXDiff - bboxPath.width}, ${-leftCornersYDiff - bboxPath.height / 2})`
    const mirrorXLower = `scale(-1, 1)`
    const translateXUpper = `translate(${-upperRange})`
    const translateXLower = `translate(${lowerRange})`

    upperChevronS.attr('transform', `${mirrorXLower} ${translateAlign} ${translateXUpper}`)
    lowerChevronS.attr('transform', `${translateAlign} ${translateXLower}`)
    const sliderRectBreadthString = cssVarFromSelection(sliderRectS, '--rect-slider-breadth') ?? '30'
    const sliderRectBreadth = parseInt(sliderRectBreadthString)
    sliderRectS
      .attr('x', lowerRange)
      .attr('width', upperRange - lowerRange)
      .attr('y', -1 * sliderRectBreadth / 2)
      .attr('height', sliderRectBreadth)
  } else {
    const translateX = -leftCornersXDiff + bboxDomain.width - bboxPath.width / 2
    const upperRange = scaledValues.getRangeByPercent(upperRangeLimitPercent, false, 'vertical')
    const translateYUpper = upperRange - bboxPath.height
    const lowerRange = scaledValues.getRangeByPercent(lowerRangeLimitPercent, false, 'vertical')
    const translateYLower = lowerRange + bboxPath.height
    const mirrorYLower = `scale(1, -1)`

    upperChevronS.attr('transform', `translate(${translateX}, ${translateYUpper})`)
    lowerChevronS.attr('transform', `translate(${translateX}, ${translateYLower}) ${mirrorYLower}`)
    const sliderRectBreadthString = cssVarFromSelection(sliderRectS, '--rect-slider-breadth') ?? '30'
    const sliderRectBreadth = parseInt(sliderRectBreadthString)
    sliderRectS
      .attr('x', -1 * sliderRectBreadth / 2)
      .attr('width', sliderRectBreadth)
      .attr('y', upperRange)
      .attr('height', lowerRange - upperRange)
  }
}

function addSliderDrag(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const originalSeries = axisS.datum().series.originalSeries
  const axisD = originalSeries.axes.find(axis => axis.key === axisS.datum().key)
  if (!axisD) return

  const upperChevronBackgroundS = axisS.selectAll('.slider-up').selectAll(`.${backgroundSVGOnly}`)
  const lowerChevronBackgroundS = axisS.selectAll('.slider-down').selectAll(`.${backgroundSVGOnly}`)
  const sliderRectS = axisS.selectAll('.slider-rect')

  function getPercent(e) {
    const dragDown = relateDragWayToSelection(e, originalSeries.renderer.drawAreaBgS)
    if (dragDown === undefined) return undefined
    return originalSeries.responsiveState.currentlyFlipped ? dragDown.fromLeftPercent : 1 - dragDown.fromTopPercent
  }

  function getPercentDiff(e) {
    const dragDown = relateDragWayToSelectionByDiff(e, originalSeries.renderer.drawAreaBgS)
    if (dragDown === undefined) return undefined
    return originalSeries.responsiveState.currentlyFlipped ? dragDown.dxRelative : -dragDown.dyRelative
  }

  const onDrag = (e, limit: 'upper' | 'lower' | 'rect') => {
    const onUpperLower = () => {
      const percent = getPercent(e)
      if (percent === undefined) return
      if (limit === 'upper') {
        axisD.upperRangeLimitPercent = percent >= axisD.lowerRangeLimitPercent ? percent : axisD.lowerRangeLimitPercent
      }
      if (limit === 'lower') {
        axisD.lowerRangeLimitPercent = percent <= axisD.upperRangeLimitPercent ? percent : axisD.upperRangeLimitPercent
      }
    }
    const onRect = () => {
      const percentDiff = getPercentDiff(e)
      if (percentDiff === undefined || axisD.lowerRangeLimitPercent + percentDiff < 0
        || axisD.upperRangeLimitPercent + percentDiff > 1 ) return
      axisD.upperRangeLimitPercent += percentDiff
      axisD.lowerRangeLimitPercent += percentDiff
    }
    limit === 'rect' ? onRect() : onUpperLower()
    originalSeries.renderer.windowS.dispatch('resize')
  }

  const throttledDrag = throttle(onDrag, 25)

  upperChevronBackgroundS.call(drag()
    .on("drag.dragAxisLimitUpper", (e) => throttledDrag.func(e, 'upper'))
    .on("end.dragAxisLimitUpper", (e) => onDrag(e, 'upper'))
  )
  lowerChevronBackgroundS.call(drag()
    .on("drag.dragAxisLimitLower", (e) => throttledDrag.func(e, 'lower'))
    .on("end.dragAxisLimitLower", (e) => onDrag(e, 'lower'))
  )
  sliderRectS.call(drag()
    .on("drag.dragAxisLimitRect", (e) => throttledDrag.func(e, 'rect'))
    .on("end.dragAxisLimitRect", (e) => onDrag(e, 'rect'))
  )
}
