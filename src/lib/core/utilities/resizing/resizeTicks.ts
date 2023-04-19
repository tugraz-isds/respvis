import {boundRegex, Bounds, convertToPx, findMatchingBoundsIndex, TickOrientation} from "./matchBounds";

export function calceTickAngle(element: Element, tickOrientation: TickOrientation) {
  function calcBoundWidthToPx(bounds: Bounds) {
    const boundMatch = bounds.minWidth?.match(boundRegex);
    if (!boundMatch) return 0 //TODO: enforce use of minwidth in arguments
    const [, boundWidth, boundWidthUnit] = boundMatch
    return convertToPx(element, boundWidth, boundWidthUnit)
  }

  const i = findMatchingBoundsIndex(element, tickOrientation.bounds)
  if (tickOrientation.orientation[i] === 'horizontal') return 0
  if (tickOrientation.orientation[i] === 'vertical') return 90
  if (i < 1) return 0

  const prevBoundWidth = calcBoundWidthToPx(tickOrientation.bounds[i - 1])
  const currentBoundWidth = calcBoundWidthToPx(tickOrientation.bounds[i])
  const elementWidth = element.getBoundingClientRect().width

  const angleRatio = (prevBoundWidth - currentBoundWidth) / (prevBoundWidth - elementWidth)

  // console.log(i, element, tickOrientation, currentBoundWidth, prevBoundWidth, elementWidth)

  return tickOrientation.orientation[i - 1] === 'vertical' ? (90 - angleRatio * 90) : angleRatio * 90
}
