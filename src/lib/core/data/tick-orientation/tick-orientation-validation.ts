import {boundRegex, Orientation, RotationDirection, SVGHTMLElement} from "../../constants/types";
import {indexFromBounds} from "../breakpoint/matchBounds";
import {RespValByValueOptional} from "../responsive-value/responsive-value-value";
import {BreakpointsValid} from "../breakpoint/breakpoint-validation";
import {convertToPx} from "../../utilities/dom/units";

export type TickOrientationArgs = {
  rotationDirection?: RotationDirection
  orientation: RespValByValueOptional<Orientation>
  //TODO: maybe add property for indicating abrupt or continuous transition
}

export type TickOrientationValid = Required<TickOrientationArgs>

export function tickOrientationValidation(args?: TickOrientationArgs): TickOrientationValid {
  return {
    rotationDirection: args?.rotationDirection ?? 'counterclockwise',
    orientation: args?.orientation ?? 'horizontal'
  }
}

export function calcTickAngle(element: SVGHTMLElement, tickOrientation: TickOrientationValid) {
  function calcBoundWidthToPx(bounds: BreakpointsValid) {
    const boundMatch = bounds.minWidth?.match(boundRegex);
    if (!boundMatch) return 0 //TODO: enforce use of minwidth in arguments
    const [, boundWidth, boundWidthUnit] = boundMatch
    return convertToPx(element, boundWidth, boundWidthUnit)
  }

  //TODO: fix refactoring issues
  const boundsIndex = indexFromBounds(element, tickOrientation.bounds, 'width')
  const orientationIndex = boundsIndex >= 0 ? boundsIndex : tickOrientation.orientation.length - 1
  const verticalAngle = tickOrientation.rotationDirection === 'clockwise' ? 90 : -90

  if (tickOrientation.orientation[orientationIndex] === 'horizontal') return 0
  if (tickOrientation.orientation[orientationIndex] === 'vertical') return verticalAngle

  const prevBoundWidth = calcBoundWidthToPx(tickOrientation.bounds[boundsIndex - 1])
  const currentBoundWidth = calcBoundWidthToPx(tickOrientation.bounds[boundsIndex])
  const elementWidth = element.getBoundingClientRect().width

  const angleRatio = (prevBoundWidth - elementWidth) / (prevBoundWidth - currentBoundWidth)

  return tickOrientation.orientation[boundsIndex - 1] === 'vertical' ? (verticalAngle - angleRatio * verticalAngle) : angleRatio * verticalAngle
}
