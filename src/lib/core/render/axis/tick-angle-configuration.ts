import {AxisSelection} from "./axis-render";
import {select, Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {elementFromSelection} from "../../utilities/d3/util";
import {cssLengthInPx} from "../../utilities/dom/units";
import {tickAngleCalculation} from "./tick-angle-calculation";
import {normalizeAngle} from "../../utilities/angle";

export function tickAngleConfiguration(axisS: AxisSelection, ticksS: Selection<SVGHTMLElement>) {
  const angle = tickAngleCalculation(axisS)
  ticksS.selectAll<Element, any>('.tick').each((d, i, g) => {
    configureTick(select(g[i]), angle, axisS)
  })
}

function configureTick(tickS: Selection<Element>, angle: number, axisS: AxisSelection) {
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

  pivotS //.transition().duration(200) //TODO: enable D3 transitions when being able to differ between initial render and succeeding renders
    .attr("transform", axisLocation === 'bottom' ?
      `translate(0, ${transformRelative + transformFixed}) rotate(${normalizedAngle})` : axisLocation === 'top' ?
      `translate(0, -${transformRelative + transformFixed}) rotate(${normalizedAngle})` : axisLocation === 'left' ?
      `translate(-${transformRelative + transformFixed}, 0) rotate(${normalizedAngle})` : //right
      `translate(${transformRelative + transformFixed}, 0) rotate(${normalizedAngle})`
    )
}

//TODO: Add valid configurations for other axes than bottom
const tickAngleConfig = (angle: number) => {
  return {
    bottom: horizontalConfig(angle),
    left: horizontalConfig(normalizeAngle(angle - 90)),
    right: horizontalConfig(normalizeAngle(angle + 90)),
    top: horizontalConfig(angle),
  } as const
}
const horizontalConfig = (angle: number) => {
  const anchorStart = (angle > 15 && angle < 165)
  const anchorMiddle = (angle >= 345) || (angle >= 0 && angle <= 15) || (angle >= 165 && angle <= 195)
  // const anchorEnd = (angle < 345 && angle > 195)

  const baseLineHanging = (angle >= 0 && angle <= 15) || (angle >= 345)
  const baseLineAuto = (angle >= 165 && angle <= 195)
  // const baseLineMiddle = (angle >= 15 && angle <= 165) || (angle >= 195 && angle <= 345)

  const moreSpace = (angle >= 345) || (angle >= 0 && angle <= 15) || (angle >= 165 || angle <= 195)
  return {
    textAnchor: anchorStart ? 'start' : anchorMiddle ? 'middle' : 'end',
    dominantBaseline: baseLineHanging ? 'hanging' : baseLineAuto ? 'auto' : 'middle',
    transformFixed: moreSpace ? 6 : 4
  } as const
}
