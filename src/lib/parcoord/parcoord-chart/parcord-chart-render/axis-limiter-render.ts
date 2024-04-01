import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {drag, Selection} from "d3";
import {pathChevronRender} from "../../../core";
import {bboxDiffSVG} from "../../../core/utilities/position/diff";
import {throttle} from "../../../core/utilities/d3/util";
import {relateDragWayToSelection} from "../../../core/utilities/d3/drag";
import {bgSVGOnlyRender} from "../../../core/render/util/bg-svg-only-render";
import {backgroundSVGOnly} from "../../../core/constants/dom/classes";

export function parcoordChartAxisLimiterRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  chevronSlidersRender(axisS)
  chartAlignSliders(axisS)
  addSliderDrag(axisS)
}

function chevronSlidersRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const flipped = axisS.datum().series.responsiveState.currentlyFlipped
  const direction = (flipped ? 'right' : 'down')
  const upperChevronS = pathChevronRender(axisS, ['slider-up'], [direction])
  bgSVGOnlyRender(upperChevronS, [{scale: 2}], upperChevronS.select('path'))
  const lowerChevronS = pathChevronRender(axisS, ['slider-down'], [direction])
  bgSVGOnlyRender(lowerChevronS, [{scale: 2}], lowerChevronS.select('path'))
}

function chartAlignSliders(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const {upperRangeLimitPercent, lowerRangeLimitPercent, scaledValues, series} = axisS.datum()
  const upperChevronS= axisS.selectAll<SVGGElement, any>('.slider-up')
  const lowerChevronS = axisS.selectAll<SVGGElement, any>('.slider-down')
  const domainS = axisS.select<SVGPathElement>('.domain')
  const {leftCornersXDiff, leftCornersYDiff, bbox2: bboxPath, bbox1: bboxDomain} =
    bboxDiffSVG(domainS, upperChevronS.select('path'))
  
  if (series.responsiveState.currentlyFlipped) {
    const rangeXUpper = scaledValues.getRangeByPercent(upperRangeLimitPercent, false, 'horizontal')
    const rangeXLower = scaledValues.getRangeByPercent(lowerRangeLimitPercent, false, 'horizontal')

    const translateAlign = `translate(${-leftCornersXDiff - bboxPath.width}, ${-leftCornersYDiff - bboxPath.height / 2})`
    const mirrorXLower = `scale(-1, 1)`
    const translateXUpper = `translate(${-rangeXUpper})`
    const translateXLower = `translate(${rangeXLower})`

    upperChevronS.attr('transform', `${mirrorXLower} ${translateAlign} ${translateXUpper}`)
    lowerChevronS.attr('transform', `${translateAlign} ${translateXLower}`)
  } else {
    const translateX = -leftCornersXDiff + bboxDomain.width - bboxPath.width / 2
    const translateYUpper = scaledValues.getRangeByPercent(upperRangeLimitPercent, false, 'vertical') - bboxPath.height
    const translateYLower = scaledValues.getRangeByPercent(lowerRangeLimitPercent, false, 'vertical') + bboxPath.height
    const mirrorYLower = `scale(1, -1)`

    upperChevronS.attr('transform', `translate(${translateX}, ${translateYUpper})`)
    lowerChevronS.attr('transform', `translate(${translateX}, ${translateYLower}) ${mirrorYLower}`)
  }
}

function addSliderDrag(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const originalSeries = axisS.datum().series.originalSeries
  const axisD = originalSeries.axes.find(axis => axis.key === axisS.datum().key)
  if (!axisD) return

  const upperChevronBackgroundS = axisS.selectAll('.slider-up').selectAll(`.${backgroundSVGOnly}`)
  const lowerChevronBackgroundS = axisS.selectAll('.slider-down').selectAll(`.${backgroundSVGOnly}`)

  function getPercent(e) {
    const dragDown = relateDragWayToSelection(e, originalSeries.renderer.drawAreaBgS)
    if (dragDown === undefined) return undefined
    return originalSeries.responsiveState.currentlyFlipped ? dragDown.fromLeftPercent : 1 - dragDown.fromTopPercent
  }

  const onDrag = (e, limit: 'upper' | 'lower') => {
    const percent = getPercent(e)
    if (percent === undefined) return
    if (limit === 'upper') {
      axisD.upperRangeLimitPercent = percent >= axisD.lowerRangeLimitPercent ? percent : axisD.lowerRangeLimitPercent
    }
    if (limit === 'lower') {
      axisD.lowerRangeLimitPercent = percent <= axisD.upperRangeLimitPercent ? percent : axisD.upperRangeLimitPercent
    }
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
}
