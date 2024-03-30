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
  if (axisS.datum().series.responsiveState.currentlyFlipped) verticalChartAlignSliders(axisS)
  else horizontalChartAlignSliders(axisS)
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

function horizontalChartAlignSliders(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const {upperRangeLimitPercent, lowerRangeLimitPercent, scaledValues} = axisS.datum()
  const upperChevronS= axisS.selectAll('.slider-up')
  const lowerChevronS = axisS.selectAll('.slider-down')
  const domainS = axisS.select<SVGPathElement>('.domain')
  const {leftCornersXDiff, bbox1, bbox2} = bboxDiffSVG(domainS, upperChevronS.select('path'))

  const translateX = -leftCornersXDiff + bbox1.width - bbox2.width / 2

  const rangeMax = scaledValues.getOriginalRange()[0]
  const translateYUpper = rangeMax - rangeMax * upperRangeLimitPercent - bbox2.height
  const translateYLower = rangeMax - rangeMax * lowerRangeLimitPercent + bbox2.height
  const mirrorYLower = `scale(1, -1)`

  upperChevronS.attr('transform', `translate(${translateX}, ${translateYUpper})`)
  lowerChevronS.attr('transform', `translate(${translateX}, ${translateYLower}) ${mirrorYLower}`)
}

function verticalChartAlignSliders(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  //TODO: fuse with horizontal function (only small differences)
  const {upperRangeLimitPercent, lowerRangeLimitPercent, scaledValues} = axisS.datum()
  const upperChevronS= axisS.selectAll<SVGGElement, any>('.slider-up')
  const lowerChevronS = axisS.selectAll<SVGGElement, any>('.slider-down')
  const domainS = axisS.select<SVGPathElement>('.domain')

  const rangeMax = scaledValues.getOriginalRange()[1]
  const rangeXUpper = rangeMax * upperRangeLimitPercent
  const rangeXLower = rangeMax * lowerRangeLimitPercent

  const {leftCornersXDiff, leftCornersYDiff, bbox2: bboxPath} =
    bboxDiffSVG(domainS, upperChevronS.select('path'))

  let translateX = -leftCornersXDiff - bboxPath.width
  let translateY = -leftCornersYDiff - bboxPath.height / 2
  const translateAlign = `translate(${translateX}, ${translateY})`
  const mirrorXLower = `scale(-1, 1)`
  const translateXUpper = `translate(${-rangeXUpper})`
  const translateXLower = `translate(${rangeXLower})`

  upperChevronS.attr('transform', `${mirrorXLower} ${translateAlign} ${translateXUpper}`) // //  //rotate(90)
  lowerChevronS.attr('transform', `${translateAlign} ${translateXLower}`)
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
