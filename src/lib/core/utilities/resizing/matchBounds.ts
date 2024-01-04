import {CSSLength, LengthDimension, SVGHTMLElement} from "./types";
import {convertToPx} from "../length";
import {BoundsValid, LenghtDimensionIndices} from "./bounds";
import {ConfigBoundable, isConfigTupleBoundable} from "./boundable";

export const boundRegex = /(\d+(?:\.\d+)?)(px|rem|em)/
type Bound = `${number}${CSSLength}`
// export type Bounds = {
//   minHeight?: Bound,
//   minWidth?: Bound,
//   maxHeight?: Bound,
//   maxWidth?: Bound
// }

export type TickOrientation = {
  bounds: BoundsValid,
  boundElement?: SVGHTMLElement,
  rotationDirection?: 'clockwise' | 'counterclockwise'
  orientation: ('horizontal' | 'vertical' | 'transition')[]
}

export function boundArgByIndices<T>(indices: LenghtDimensionIndices, arg: ConfigBoundable<T>) {
  if (!isConfigTupleBoundable(arg)) {
    return arg
  }
  const currentIndex = indices[arg.dependentOn]
  let tuple = arg.tuples[0]
  for (let i = 1; i < arg.tuples.length; i++) {
    if (arg.tuples[i][0] <= currentIndex) tuple = arg.tuples[i]
  }
  return tuple[1]
}


export type LengthDimensionBounds = {
  width: BoundsValid,
  height: BoundsValid,
}

export function indexFromBounds(element: SVGHTMLElement, bounds: BoundsValid, dimension: LengthDimension) {
  const rect = element.getBoundingClientRect()
  const referenceValue = rect[dimension]
  if (bounds.values.length === 0) return 0
  for (let i = 0; i < bounds.values.length; i++) {
    if (referenceValue < convertToPx(element, bounds.values[i],  bounds.unit)) return i
  }
  return bounds.values.length
}

