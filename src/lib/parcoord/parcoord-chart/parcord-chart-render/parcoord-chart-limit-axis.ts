import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {drag, Selection} from "d3";
import {pathChevronRender} from "../../../core";
import {bboxDiffSVG} from "../../../core/utilities/position/diff";
import {throttle} from "../../../core/utilities/d3/util";
import {relateDragWayToSelection} from "../../../core/utilities/d3/drag";
import {ParcoordSeries} from "../../parcoord-series";
import {bgSVGOnlyRender} from "../../../core/render/util/bg-svg-only-render";
import {backgroundSVGOnly} from "../../../core/constants/dom/classes";

export function parcoordChartLimitAxis(axisS: Selection<SVGGElement, KeyedAxisValid>,
                                       drawAreaBackgroundS: Selection<SVGRectElement>,
                                       series: ParcoordSeries) {
  chevronSlidersRender(axisS)
  if (series.responsiveState.currentlyFlipped) verticalChartAlignSliders(axisS)
  else horizontalChartAlignSliders(axisS)
  addSliderDrag(axisS, drawAreaBackgroundS, series)
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

  const range = scaledValues.scale.range()
  const translateYUpper = range[0] - range[0] * upperRangeLimitPercent - bbox2.height

  const translateYLower = range[0] - range[0] * lowerRangeLimitPercent + bbox2.height
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

  const range = scaledValues.scale.range()
  const rangeXUpper = range[1] * upperRangeLimitPercent
  const rangeXLower = range[1] * lowerRangeLimitPercent

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

function addSliderDrag(axisS: Selection<SVGGElement, KeyedAxisValid>,
                             drawAreaBackgroundS: Selection<SVGRectElement>,
                             series: ParcoordSeries) {
  const axisD = series.axes.find(axis => axis.key === axisS.datum().key)
  if (!axisD) return

  const upperChevronBackgroundS = axisS.selectAll('.slider-up').selectAll(`.${backgroundSVGOnly}`)
  const lowerChevronBackgroundS = axisS.selectAll('.slider-down').selectAll(`.${backgroundSVGOnly}`)

  function getPercent(e) {
    const dragDown = relateDragWayToSelection(e, drawAreaBackgroundS)
    if (dragDown === undefined) return undefined
    return series.responsiveState.currentlyFlipped ? dragDown.fromLeftPercent : 1 - dragDown.fromTopPercent
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
      series.renderer.windowSelection.dispatch('resize')
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
