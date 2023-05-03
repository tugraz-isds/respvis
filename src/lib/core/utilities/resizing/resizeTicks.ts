import {boundRegex, Bounds, convertToPx, findMatchingBoundsIndex, TickOrientation} from "./matchBounds";

export function calcTickAngle(element: Element, tickOrientation: TickOrientation) {
  function calcBoundWidthToPx(bounds: Bounds) {
    const boundMatch = bounds.minWidth?.match(boundRegex);
    if (!boundMatch) return 0 //TODO: enforce use of minwidth in arguments
    const [, boundWidth, boundWidthUnit] = boundMatch
    return convertToPx(element, boundWidth, boundWidthUnit)
  }

  const boundsIndex = findMatchingBoundsIndex(element, tickOrientation.bounds)
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
