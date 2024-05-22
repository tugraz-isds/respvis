import {
  getResponsiveValueInformation,
  isResponsiveValueByValue,
} from "../../data/responsive-value/responsive-value-value";
import {elementFromSelection} from "../../utilities/d3/util";
import {Breakpoints, getActiveBreakpoints} from "respvis-core/data/breakpoints/breakpoints";
import {cssLengthInPx} from "../../utilities/dom/units";
import {AxisSelection} from "./render-axis";
import {CSSAbsoluteLengthUnit, CSSEMUnit, SVGGroupingElement, UnitValue} from "../../constants/types";


export function calculateTickAngles(axisS: AxisSelection) {
  const angleOrBreakData = calculateTickAngleOrInterpolationData(axisS)
  if (typeof angleOrBreakData === 'number') {
    return angleOrBreakData
  }
  const {breaks, element,
    preOrientation, postOrientation,
    tickOrientation} = angleOrBreakData
  const [preBreak, postBreak] = breaks

  const elementLength = element.getBoundingClientRect()[tickOrientation.dependentOn]
  const angleDiff = Math.abs(preOrientation - postOrientation)
  const lengthRatio = (elementLength - preBreak) / (postBreak - preBreak)
  const preSmaller = preOrientation < postOrientation

  return preSmaller ? preOrientation + lengthRatio * angleDiff : preOrientation - lengthRatio * angleDiff
}

function calculateTickAngleOrInterpolationData(axisS: AxisSelection) {
  const {renderer, breakPoints, ...restAxisD} = axisS.datum()
  const isFlipped = restAxisD.series.responsiveState.currentlyFlipped
  const tickOrientation = isFlipped ? restAxisD.tickOrientationFlipped : restAxisD.tickOrientation

  if (!isResponsiveValueByValue(tickOrientation)) {
    return tickOrientation
  }

  const chartElement = elementFromSelection(renderer.chartS)
  const axisDomainElement = elementFromSelection(axisS.select<SVGGroupingElement>('.domain'))
  const scopes = {chart: chartElement, self: axisDomainElement}

  const {
    element, layout, valueAtPreLayoutIndex,
    valueAtPostLayoutIndex, valueAtLayoutIndex,
    postLayoutIndex, preLayoutIndex
  } = getResponsiveValueInformation(tickOrientation, scopes)

  if (valueAtLayoutIndex !== null) return valueAtLayoutIndex
  if (valueAtPreLayoutIndex === null || preLayoutIndex === null) return 0
  if (valueAtPostLayoutIndex === null || postLayoutIndex === null) return valueAtPreLayoutIndex

  const breakpoints = element === chartElement ?
    renderer.windowS.datum().breakpoints[layout] : breakPoints[layout]
  
  return {
    preOrientation: valueAtPreLayoutIndex,
    postOrientation: valueAtPostLayoutIndex,
    element,
    breaks: getInterpolationBreakpoints({breakpoints, preLayoutIndex, postLayoutIndex, element}),
    isFlipped,
    tickOrientation
  } as const
}

type GetInterPolationArgs = {
  element: Element,
  breakpoints: Breakpoints
  preLayoutIndex: number,
  postLayoutIndex: number,
}
function getInterpolationBreakpoints(props: GetInterPolationArgs) {
  const {element, postLayoutIndex, preLayoutIndex, breakpoints} = props
  const [, breakStart] = getActiveBreakpoints(preLayoutIndex, breakpoints)
  const [breakEnd,] = getActiveBreakpoints(postLayoutIndex, breakpoints)
  const breakStartPx = breakStart.endsWith('em') ?
    cssLengthInPx(breakStart as UnitValue<CSSEMUnit>, element) :
    cssLengthInPx(breakStart as UnitValue<CSSAbsoluteLengthUnit>)
  const breakEndPx = breakEnd.endsWith('em') ?
    cssLengthInPx(breakEnd as UnitValue<CSSEMUnit>, element) :
    cssLengthInPx(breakEnd as UnitValue<CSSAbsoluteLengthUnit>)
  return [breakStartPx, breakEndPx] as const
}
