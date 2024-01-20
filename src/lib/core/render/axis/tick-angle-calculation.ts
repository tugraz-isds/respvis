import {
  getResponsiveValueInformation,
  isResponsiveValueByValue,
  RespValByValue,
} from "../../data/responsive-value/responsive-value-value";
import {elementFromSelection} from "../../utilities/d3/util";
import {BreakpointsValid, getActiveBreakpoints} from "../../data/breakpoint/breakpoint-validation";
import {cssLengthInPx} from "../../utilities/dom/units";
import {AxisSelection} from "./axis-render";
import {Orientation} from "../../constants/types";


export function tickAngleCalculation(axisS: AxisSelection) {
  const {tickOrientation} = axisS.datum()
  const angleOrBreakData = calcTickAngleOrInterpolationData(axisS)
  if (typeof angleOrBreakData === 'number') {
    return angleOrBreakData
  }
  const layoutDirection = (tickOrientation.orientation as RespValByValue<Orientation>).dependentOn
  const {breaks, element,
    preOrientation, verticalAngle} = angleOrBreakData
  const [preBreak, postBreak] = breaks

  const elementLength = element.getBoundingClientRect()[layoutDirection]
  const angleRatio = (postBreak - elementLength) / (postBreak - preBreak)
  return preOrientation === 'vertical' ? angleRatio * verticalAngle : (verticalAngle - angleRatio * verticalAngle)
}

function calcTickAngleOrInterpolationData(axisS: AxisSelection) {
  const {tickOrientation, renderer, bounds} = axisS.datum()
  let verticalAngle = tickOrientation.rotationDirection === 'clockwise' ? -90 : 90
  if (!isResponsiveValueByValue(tickOrientation.orientation)) {
    return tickOrientation.orientation === 'horizontal' ? 0 : verticalAngle
  }
  if (tickOrientation.orientation.dependentOn === 'height') verticalAngle *= -1
  const chartElement = elementFromSelection(renderer.chartSelection)
  const axisElement = elementFromSelection(axisS)
  const scopes = {chart: chartElement, self: axisElement}

  const {
    element, layout, valueAtPreLayoutIndex,
    valueAtPostLayoutIndex, valueAtLayoutIndex,
    postLayoutIndex, preLayoutIndex
  } = getResponsiveValueInformation(tickOrientation.orientation, scopes)

  if (valueAtLayoutIndex !== null) return valueAtLayoutIndex === 'horizontal' ? 0 : verticalAngle
  if (valueAtPreLayoutIndex === null || preLayoutIndex === null) return 0
  if (valueAtPostLayoutIndex === null || postLayoutIndex === null) return valueAtPreLayoutIndex === 'horizontal' ? 0 : verticalAngle
  if (valueAtPreLayoutIndex === 'horizontal' && valueAtPostLayoutIndex === 'horizontal') return 0
  if (valueAtPreLayoutIndex === 'vertical' && valueAtPostLayoutIndex === 'vertical') return verticalAngle

  const breakpoints = element === chartElement ?
    renderer.windowSelection.datum().bounds[layout] : bounds[layout]
  
  return {
    preOrientation: valueAtPreLayoutIndex,
    element,
    breaks: getInterpolationBreakpoints({breakpoints, preLayoutIndex, postLayoutIndex, element}),
    verticalAngle
  } as const
}

type getInterPolationArgs = {
  element: Element,
  breakpoints: BreakpointsValid
  preLayoutIndex: number,
  postLayoutIndex: number,
}
function getInterpolationBreakpoints(props: getInterPolationArgs) {
  const {element, postLayoutIndex, preLayoutIndex, breakpoints} = props
  const [, breakStart] = getActiveBreakpoints(preLayoutIndex, breakpoints)
  const [breakEnd,] = getActiveBreakpoints(postLayoutIndex, breakpoints)
  const breakStartPx = cssLengthInPx(breakStart, element)
  const breakEndPx = cssLengthInPx(breakEnd, element)
  return [breakStartPx, breakEndPx] as const
}
