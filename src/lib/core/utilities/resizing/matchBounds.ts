export const boundRegex = /(\d+(?:\.\d+)?)(px|rem)/
type Bound = `${number}${'px' | 'rem' | 'em'}`
export type Bounds = {
  minHeight?: Bound,
  minWidth?: Bound,
  maxHeight?: Bound,
  maxWidth?: Bound
}

export type TickOrientation = {
  bounds: Bounds[],
  boundElement?: Element,
  rotationDirection?: 'clockwise' | 'counterclockwise'
  orientation: ('horizontal' | 'vertical' | 'transition')[]
}

export function findMatchingBoundsIndex(element: Element, boundsList: Bounds[]) {
  for (const [index, bounds] of boundsList.entries()) {
    if (matchesBounds(element, bounds)) return index
  }
  return -1
}

export function matchesBounds(element: Element, bounds: Bounds) {
  const { width, height } = element.getBoundingClientRect()

  const minWidthMatch = bounds.minWidth?.match(boundRegex);
  if (minWidthMatch) {
    const [, minWidth, minWidthUnit] = minWidthMatch
    if (convertToPx(element, minWidth,  minWidthUnit) > width) return false
  }

  const minHeightMatch = bounds.minHeight?.match(boundRegex);
  if (minHeightMatch) {
    const [, minHeight, minHeightUnit] = minHeightMatch
    if (convertToPx(element, minHeight,  minHeightUnit) > height) return false
  }

  const maxWidthMatch = bounds.maxWidth?.match(boundRegex);
  if (maxWidthMatch) {
    const [, maxWidth, maxWidthUnit] = maxWidthMatch
    if (convertToPx(element, maxWidth,  maxWidthUnit) < width) return false
  }

  const maxHeightMatch = bounds.maxHeight?.match(boundRegex);
  if (maxHeightMatch) {
    const [, maxHeight, maxHeightUnit] = maxHeightMatch
    if (convertToPx(element, maxHeight,  maxHeightUnit) < height) return false
  }

  return true
}

export function convertToPx(element, value, unit) {
  if (unit === 'px') {
    return value;
  } else if (unit === 'rem') {
    return value * parseFloat(getComputedStyle(document.documentElement).fontSize);
  } else if (unit === 'em') {
    return value * parseFloat(getComputedStyle(element).fontSize);
  } else {
    throw new Error(`Invalid unit: ${unit}`);
  }
}
