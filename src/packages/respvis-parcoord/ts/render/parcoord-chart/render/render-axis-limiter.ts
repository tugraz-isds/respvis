import {
  backgroundSVGOnly,
  bboxDiffSVG,
  cssVarFromSelection,
  pathChevronRender,
  relateDragWayToSelection,
  relateDragWayToSelectionByDiff,
  renderBgSVGOnlyBBox,
  throttle
} from "respvis-core";
import {drag, Selection} from "d3";
import {KeyedAxis} from "../../validate-keyed-axis";

export function renderAxisLimiter(axisS: Selection<SVGGElement, KeyedAxis>) {
  renderChevronLimiter(axisS)
  renderRectLimiter(axisS)
  alignLimiters(axisS)
  addLimiterDrag(axisS)
}

function renderChevronLimiter(axisS: Selection<SVGGElement, KeyedAxis>) {
  const flipped = axisS.datum().series.responsiveState.currentlyFlipped
  const direction = (flipped ? 'right' : 'down')
  const upperChevronS = pathChevronRender(axisS, ['slider-up'], [{type: direction, scale: 1}])
  renderBgSVGOnlyBBox(upperChevronS, [{scale: 4}], upperChevronS.select('path'))
    .classed('cursor', true)
    .classed('cursor--range-vertical', !flipped)
    .classed('cursor--range-horizontal cursor--range-left', flipped)
  const lowerChevronS = pathChevronRender(axisS, ['slider-down'], [{type: direction, scale: 1}])
  renderBgSVGOnlyBBox(lowerChevronS, [{scale: 4}], lowerChevronS.select('path'))
    .classed('cursor', true)
    .classed('cursor--range-horizontal ', flipped)
    .classed('cursor--range-vertical cursor--range-up', !flipped)
}

function renderRectLimiter(axisS: Selection<SVGGElement, KeyedAxis>) {
  const axisD = axisS.datum()
  if (!axisD) return
  const flipped = axisD.series.responsiveState.currentlyFlipped
  const rectLimiterDragable = axisD.upperRangeLimitPercent < 1 || axisD.lowerRangeLimitPercent > 0
  axisS.selectAll('.slider-rect')
    .data([null])
    .join('rect')
    .classed('slider-rect', true)
    .classed('cursor cursor--range-rect', rectLimiterDragable)
    .classed('cursor--range-rect-horizontal', flipped)
}

function alignLimiters(axisS: Selection<SVGGElement, KeyedAxis>) {
  const {upperRangeLimitPercent, lowerRangeLimitPercent, scaledValues, series} = axisS.datum()
  const upperChevronS= axisS.selectAll<SVGGElement, any>('.slider-up')
  const lowerChevronS = axisS.selectAll<SVGGElement, any>('.slider-down')
  const rectLimiterS = axisS.selectAll<SVGRectElement, any>('.slider-rect')
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
    const rectLimiterBreadthString = cssVarFromSelection(rectLimiterS, '--rect-slider-breadth') ?? '30'
    const rectLimiterBreadth = parseInt(rectLimiterBreadthString)
    rectLimiterS
      .attr('x', lowerRange)
      .attr('width', upperRange - lowerRange)
      .attr('y', -1 * rectLimiterBreadth / 2)
      .attr('height', rectLimiterBreadth)
  } else {
    const translateX = -leftCornersXDiff + bboxDomain.width - bboxPath.width / 2
    const upperRange = scaledValues.getRangeByPercent(upperRangeLimitPercent, false, 'vertical')
    const translateYUpper = upperRange - bboxPath.height
    const lowerRange = scaledValues.getRangeByPercent(lowerRangeLimitPercent, false, 'vertical')
    const translateYLower = lowerRange + bboxPath.height
    const mirrorYLower = `scale(1, -1)`

    upperChevronS.attr('transform', `translate(${translateX}, ${translateYUpper})`)
    lowerChevronS.attr('transform', `translate(${translateX}, ${translateYLower}) ${mirrorYLower}`)
    const rectLimiterBreadthString = cssVarFromSelection(rectLimiterS, '--rect-slider-breadth') ?? '30'
    const rectLimiterBreadth = parseInt(rectLimiterBreadthString)
    rectLimiterS
      .attr('x', -1 * rectLimiterBreadth / 2)
      .attr('width', rectLimiterBreadth)
      .attr('y', upperRange)
      .attr('height', lowerRange - upperRange)
  }
}

function addLimiterDrag(axisS: Selection<SVGGElement, KeyedAxis>) {
  const originalSeries = axisS.datum().series.originalSeries
  const axisD = originalSeries.axes.find(axis => axis.key === axisS.datum().key)
  if (!axisD) return

  const upperChevronBackgroundS = axisS.selectAll('.slider-up').selectAll(`.${backgroundSVGOnly}`)
  const lowerChevronBackgroundS = axisS.selectAll('.slider-down').selectAll(`.${backgroundSVGOnly}`)
  const rectLimiterS = axisS.selectAll('.slider-rect')

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
  rectLimiterS.call(drag()
    .on("drag.dragAxisLimitRect", (e) => throttledDrag.func(e, 'rect'))
    .on("end.dragAxisLimitRect", (e) => onDrag(e, 'rect'))
  )
}
