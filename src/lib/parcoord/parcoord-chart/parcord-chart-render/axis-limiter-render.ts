import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {drag, Selection} from "d3";
import {pathChevronRender} from "../../../core";
import {bboxDiffSVG} from "../../../core/utilities/position/diff";
import {throttle} from "../../../core/utilities/d3/util";
import {relateDragWayToSelection, relateDragWayToSelectionByDiff} from "../../../core/utilities/d3/drag";
import {bgSVGOnlyRender} from "../../../core/render/util/bg-svg-only-render";
import {backgroundSVGOnly} from "../../../core/constants/dom/classes";

export function parcoordChartAxisLimiterRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  chevronSlidersRender(axisS)
  ellipseSliderRender(axisS)
  chartAlignSliders(axisS)
  addSliderDrag(axisS)
}

function chevronSlidersRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const flipped = axisS.datum().series.responsiveState.currentlyFlipped
  const direction = (flipped ? 'right' : 'down')
  const upperChevronS = pathChevronRender(axisS, ['slider-up'], [{type: direction, scale: 1.5}])
  bgSVGOnlyRender(upperChevronS, [{scale: 2}], upperChevronS.select('path'))
  const lowerChevronS = pathChevronRender(axisS, ['slider-down'], [{type: direction, scale: 1.5}])
  bgSVGOnlyRender(lowerChevronS, [{scale: 2}], lowerChevronS.select('path'))
}

function ellipseSliderRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  axisS.selectAll('.slider-ellipse')
    .data([null])
    .join('ellipse')
    .classed('slider-ellipse', true)
}

function chartAlignSliders(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const {upperRangeLimitPercent, lowerRangeLimitPercent, scaledValues, series} = axisS.datum()
  const upperChevronS= axisS.selectAll<SVGGElement, any>('.slider-up')
  const lowerChevronS = axisS.selectAll<SVGGElement, any>('.slider-down')
  const sliderEllipseS = axisS.selectAll<SVGEllipseElement, any>('.slider-ellipse')
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
    sliderEllipseS
      .attr('rx', (upperRange - lowerRange) / 2)
      .attr('ry', 30)
      .attr('cx', lowerRange + (upperRange - lowerRange) / 2)
      .attr('cy', 0)
  } else {
    const translateX = -leftCornersXDiff + bboxDomain.width - bboxPath.width / 2
    const upperRange = scaledValues.getRangeByPercent(upperRangeLimitPercent, false, 'vertical')
    const translateYUpper = upperRange - bboxPath.height
    const lowerRange = scaledValues.getRangeByPercent(lowerRangeLimitPercent, false, 'vertical')
    const translateYLower = lowerRange + bboxPath.height
    const mirrorYLower = `scale(1, -1)`

    upperChevronS.attr('transform', `translate(${translateX}, ${translateYUpper})`)
    lowerChevronS.attr('transform', `translate(${translateX}, ${translateYLower}) ${mirrorYLower}`)
    sliderEllipseS
      .attr('rx', 30)
      .attr('ry', (lowerRange - upperRange) / 2)
      .attr('cx', 0)
      .attr('cy', upperRange + (lowerRange - upperRange) / 2)
  }
}

function addSliderDrag(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const originalSeries = axisS.datum().series.originalSeries
  const axisD = originalSeries.axes.find(axis => axis.key === axisS.datum().key)
  if (!axisD) return

  const upperChevronBackgroundS = axisS.selectAll('.slider-up').selectAll(`.${backgroundSVGOnly}`)
  const lowerChevronBackgroundS = axisS.selectAll('.slider-down').selectAll(`.${backgroundSVGOnly}`)
  const ellipseSliderS = axisS.selectAll('.slider-ellipse')

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

  const onDrag = (e, limit: 'upper' | 'lower' | 'ellipse') => {
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
    const onEllipse = () => {
      const percentDiff = getPercentDiff(e)
      if (percentDiff === undefined || axisD.lowerRangeLimitPercent + percentDiff < 0
        || axisD.upperRangeLimitPercent + percentDiff > 1 ) return
      axisD.upperRangeLimitPercent += percentDiff
      axisD.lowerRangeLimitPercent += percentDiff
    }
    limit === 'ellipse' ? onEllipse() : onUpperLower()
    if (e.type === 'end') {
      originalSeries.renderer.windowS.dispatch('resize')
    }
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
  ellipseSliderS.call(drag()
    .on("drag.dragAxisLimitEllipse", (e) => throttledDrag.func(e, 'ellipse'))
    .on("end.dragAxisLimitEllipse", (e) => onDrag(e, 'ellipse'))
  )
}
