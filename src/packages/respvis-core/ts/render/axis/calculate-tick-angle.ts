import {AxisSelection} from "./render-axis";
import {SVGGroupingElement} from "../../constants/types";


export function calculateTickAngles(axisS: AxisSelection) {
  const {renderer, breakpoints: axisBreakpoints, ...restAxisD} = axisS.datum()
  const isFlipped = restAxisD.series.responsiveState.currentlyFlipped
  const tickOrientation = isFlipped ? restAxisD.tickOrientationFlipped : restAxisD.tickOrientation

  if (typeof tickOrientation === 'number') {
    return tickOrientation
  }

  const axisDomainS = axisS
    .select<SVGGroupingElement>('.domain')
    .datum(axisS.datum())

  let {element, postBreakpoint,
    lastBreakpoint, firstBreakpoint,
    preBreakpoint} = tickOrientation.getRespValInterpolated({chart: renderer.chartS, self: axisDomainS})

  if (postBreakpoint === null) return lastBreakpoint.value
  if (preBreakpoint === null) return firstBreakpoint.value

  const elementLength = element.getBoundingClientRect()[tickOrientation.dependentOn]
  const angleDiff = postBreakpoint.value - preBreakpoint.value
  const lengthRatio = (elementLength - preBreakpoint.length) / (postBreakpoint.length - preBreakpoint.length)

  return preBreakpoint.value + lengthRatio * angleDiff
}
