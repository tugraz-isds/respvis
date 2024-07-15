import {AxisSelection} from "./render-axis";
import {select, Selection} from "d3";
import {SVGHTMLElementLegacy} from "../../constants/types";
import {cssLengthInPx} from "../../utilities/dom/units";
import {calculateTickAngles} from "./calculate-tick-angle";
import {normalizeAngle} from "../../utilities/geometry/angle";
import {elementFromSelection} from "respvis-core";

export function configureTickAngles(axisS: AxisSelection, ticksS: Selection<SVGHTMLElementLegacy>) {
  const angle = calculateTickAngles(axisS)
  ticksS.selectAll<Element, any>('.tick').each((d, i, g) => {
    configureTickAngle(select(g[i]), angle, axisS)
  })
}

function configureTickAngle(tickS: Selection<Element>, angle: number, axisS: AxisSelection) {
  const axisElement = elementFromSelection(axisS)

  const textS = tickS.select('text')
    .attr('x', null)
    .attr('y', null)
    .attr('dy', null)
  const textElement = elementFromSelection(textS) as Element

  const axisLocation = axisElement.classList.contains('axis-bottom') ? 'bottom' :
    axisElement.classList.contains('axis-left') ? 'left' :
      axisElement.classList.contains('axis-top') ? 'top' : 'right'

  const pivotS = tickS.select<SVGGElement>('.pivot')!
  pivotS.append(() => textS.node())

  const {
    textAnchor,
    dominantBaseline,
    transformFixed,
  } = tickAngleConfig(normalizeAngle(angle))[axisLocation]
  const transformRelative = cssLengthInPx('0.5em', textElement)

  textS
    .style('text-anchor', textAnchor)
    .style('dominant-baseline', dominantBaseline)
  const normalizedAngle = normalizeAngle(angle)

  pivotS
    .attr("transform", axisLocation === 'bottom' ?
      `translate(0, ${transformRelative + transformFixed}) rotate(${normalizedAngle})` : axisLocation === 'top' ?
        `translate(0, -${transformRelative + transformFixed}) rotate(${normalizedAngle})` : axisLocation === 'left' ?
          `translate(-${transformRelative + transformFixed}, 0) rotate(${normalizedAngle})` : //right
          `translate(${transformRelative + transformFixed}, 0) rotate(${normalizedAngle})`
    )
}

const tickAngleConfig = (angle: number) => {
  return {
    bottom: bottomConfig(angle),
    left: bottomConfig(normalizeAngle(angle - 90)),
    right: bottomConfig(normalizeAngle(angle + 90)),
    top: topConfig(angle),
  } as const
}
const bottomConfig = (angle: number) => {
  const {
    anchorInRotationFirstHalf, anchorParallelToAxis,
    baseLineAround180Degree, baseLineAround0Degree, moreSpace
  } = getAngleState(angle)
  return {
    textAnchor: anchorInRotationFirstHalf ? 'start' : anchorParallelToAxis ? 'middle' : 'end',
    dominantBaseline: baseLineAround0Degree ? 'hanging' : baseLineAround180Degree ? 'auto' : 'middle',
    transformFixed: moreSpace ? 6 : 4
  } as const
}

const topConfig = (angle: number) => {
  const {
    anchorInRotationFirstHalf, anchorParallelToAxis,
    baseLineAround180Degree, baseLineAround0Degree, moreSpace
  } = getAngleState(angle)
  return {
    textAnchor: anchorInRotationFirstHalf ? 'end' : anchorParallelToAxis ? 'middle' : 'start',
    dominantBaseline: baseLineAround0Degree ? 'auto' : baseLineAround180Degree ? 'hanging' : 'middle',
    transformFixed: moreSpace ? 6 : 4
  } as const
}

const getAngleState = (angle: number) => {
  return {
    anchorInRotationFirstHalf: (angle > 15 && angle < 165),
    anchorParallelToAxis: (angle >= 345) || (angle >= 0 && angle <= 15) || (angle >= 165 && angle <= 195),
    baseLineAround0Degree: (angle >= 0 && angle <= 15) || (angle >= 345),
    baseLineAround180Degree: (angle >= 165 && angle <= 195),
    moreSpace: (angle >= 345) || (angle >= 0 && angle <= 15) || (angle >= 165 || angle <= 195)
  }
}
