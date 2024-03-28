import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {drag, selectAll, Selection} from "d3";
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
  //series horizontal
  horizontalChartAlignSliders(axisS)
  horizontalChartDrag(axisS, drawAreaBackgroundS, series)
}

function chevronSlidersRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const upperChevronS = pathChevronRender(axisS, 'slider-up')
  bgSVGOnlyRender(upperChevronS, [{scale: 2}], upperChevronS.select('path'))
  const lowerChevronS = pathChevronRender(axisS, 'slider-down')
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

function horizontalChartDrag(axisS: Selection<SVGGElement, KeyedAxisValid>,
                             drawAreaBackgroundS: Selection<SVGRectElement>,
                             series: ParcoordSeries) {
  const axisD = series.axes.find(axis => axis.key === axisS.datum().key)
  if (!axisD) return

  const upperChevronBackgroundS = axisS.selectAll('.slider-up').selectAll(`.${backgroundSVGOnly}`)
  const lowerChevronBackgroundS = axisS.selectAll('.slider-down').selectAll(`.${backgroundSVGOnly}`)
  const onDrag = (e, limit: 'upper' | 'lower') => {
    const dragDown = relateDragWayToSelection(e, drawAreaBackgroundS)?.percentY
    if (dragDown === undefined) return
    const percentY = 1 - dragDown
    if (limit === 'upper') {
      axisD.upperRangeLimitPercent = percentY >= axisD.lowerRangeLimitPercent ? percentY : axisD.lowerRangeLimitPercent
    }
    if (limit === 'lower') {
      axisD.lowerRangeLimitPercent = percentY <= axisD.upperRangeLimitPercent ? percentY : axisD.upperRangeLimitPercent
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

  selectAll('html').on('mouseup', () => {
    console.log('MouseUP!')
  })
}
