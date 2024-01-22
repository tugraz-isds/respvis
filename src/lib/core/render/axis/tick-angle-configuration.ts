import {AxisSelection} from "./axis-render";
import {select, Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {elementFromSelection} from "../../utilities/d3/util";
import {cssLengthInPx} from "../../utilities/dom/units";
import {tickAngleCalculation} from "./tick-angle-calculation";

export function tickAngleConfiguration(axisS: AxisSelection, ticksS: Selection<SVGHTMLElement>) {
  const angle = tickAngleCalculation(axisS)
  ticksS.selectAll<Element, any>('.tick').each((d, i, g) => {
    configureTick(select(g[i]), angle, axisS)
  })
}

function configureTick(tickS: Selection<Element>, angle: number, axisS: AxisSelection) {
  const { tickOrientation } = axisS.datum()
  const { rotationDirection } = tickOrientation
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
  } = tickAngleConfig(angle)[axisLocation][rotationDirection]
  const transformRelative = cssLengthInPx('0.5em', textElement)

  textS
    .style('text-anchor', textAnchor)
    .style('dominant-baseline', dominantBaseline)

  pivotS //.transition().duration(200) //TODO: enable D3 transitions when being able to differ between initial render and succeeding renders
    // .attr('dy', transformTopRelative)
    .attr("transform", axisLocation === 'bottom' ?
      `translate(0, ${transformRelative + transformFixed}) rotate(${angle})` : axisLocation === 'top' ?
      `translate(0, -${transformRelative + transformFixed}) rotate(${angle})` : axisLocation === 'left' ?
      `translate(-${transformRelative + transformFixed}, 0) rotate(${angle})` : //right
      `translate(${transformRelative + transformFixed}, 0) rotate(${angle})`
    )
}

//TODO: Add valid configurations for other axes than bottom
const tickAngleConfig = (angle: number) => {
  return {
    left: leftConfig(angle),
    bottom: bottomConfig(angle),
    right: bottomConfig(angle),
    top: bottomConfig(angle),
  } as const
}
const bottomConfig = (angle: number) => {
  return {
    counterclockwise: {
      textAnchor: angle < 15 ? 'middle' : 'start',
      dominantBaseline: angle < 15 ? 'hanging' : 'middle',
      transformFixed: angle < 45 ? 8 : 4
    },
    clockwise: {
      textAnchor: angle > -15 ? 'middle' : 'end',
      dominantBaseline: angle > -15 ? 'hanging' : 'middle',
      transformFixed: angle > -45 ? 8 : 4
    }
  } as const
}

const leftConfig = (angle: number) => {
  return {
    counterclockwise: {
      textAnchor: angle > -75 ? 'end' : 'middle',
      dominantBaseline: angle > -75 ? 'middle' : 'auto',
      transformFixed: angle > -45 ? 8 : 4,
    },
    clockwise: {
      textAnchor: angle < 75 ? 'end' : 'middle',
      dominantBaseline: angle < 75 ? 'middle' : 'hanging',
      transformFixed: angle < 45 ? 8 : 4 //TODO: think if it should be 6 fixed
    }
  } as const
}
