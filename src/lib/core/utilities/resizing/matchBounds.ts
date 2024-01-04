import {BoundArg, Bounds, CSSLength, isTupleBoundArg, LengthDimension, SVGHTMLElement} from "./types";
import {convertToPx} from "../length";

export const boundRegex = /(\d+(?:\.\d+)?)(px|rem|em)/
type Bound = `${number}${CSSLength}`
// export type Bounds = {
//   minHeight?: Bound,
//   minWidth?: Bound,
//   maxHeight?: Bound,
//   maxWidth?: Bound
// }

export type TickOrientation = {
  bounds: Bounds,
  boundElement?: SVGHTMLElement,
  rotationDirection?: 'clockwise' | 'counterclockwise'
  orientation: ('horizontal' | 'vertical' | 'transition')[]
}

export function boundArgByIndices<T>(indices: BoundableIndices, arg: BoundArg<T>) {
  if (!isTupleBoundArg(arg)) {
    return arg
  }
  const currentIndex = indices[arg.dependentOn]
  let tuple = arg.tuples[0]
  for (let i = 1; i < arg.tuples.length; i++) {
    if (arg.tuples[i][0] <= currentIndex) tuple = arg.tuples[i]
  }
  return tuple[1]
}


export type Boundable = {
  width: Bounds,
  height: Bounds,
}

type BoundableIndices = {
  [Property in keyof Boundable]: number;
}

//TODO: naming of custom css properties
export function getBoundableIndices(element: SVGHTMLElement, boundable: Boundable): BoundableIndices {
  const boundsWidthTransformed = transformBoundsWithCSSVars(element, boundable.width, 'width')
  const boundsWidth = indexFromBounds(element,  boundsWidthTransformed, 'width')
  element.style.setProperty('--transform-index', 'wide-' + boundsWidth)

  const boundsHeightTransformed = transformBoundsWithCSSVars(element, boundable.height, 'height')
  const boundsHeight = indexFromBounds(element,  boundsHeightTransformed, 'height')
  element.style.setProperty('--transform-index', 'tall-' + boundsHeight)

  return { width: boundsWidth, height: boundsHeight}
}

export function indexFromBounds(element: SVGHTMLElement, bounds: Bounds, dimension: LengthDimension) {
  const rect = element.getBoundingClientRect()
  const referenceValue = rect[dimension]
  if (bounds.values.length === 0) return 0
  for (let i = 0; i < bounds.values.length; i++) {
    if (referenceValue < convertToPx(element, bounds.values[i],  bounds.unit)) return i
  }
  return bounds.values.length
}

function transformBoundsWithCSSVars(element: SVGHTMLElement, bounds: Bounds, dimension: LengthDimension): Bounds {
  const transformFactorWidth = Number(getComputedStyle(element).getPropertyValue(`--transform-factor-${dimension}`))
  const transformFactorWidthOffset = Number(getComputedStyle(element).getPropertyValue(`--transform-factor-${dimension}-offset`))

  const transformedValues = bounds.values.map(value => {
    const transformFactorWidthValid = isNaN(transformFactorWidth) ? 1 : transformFactorWidth
    const transformFactorWidthOffsetValid = isNaN(transformFactorWidthOffset) ? 0 : transformFactorWidthOffset
    return value * transformFactorWidthValid + transformFactorWidthOffsetValid
  })
  return {
    values: transformedValues,
    unit: bounds.unit
  }
}
