import {LengthDimension, SVGHTMLElement} from "../../constants/types";
import {convertToPx} from "../../utilities/length";
import {BoundsValid} from "./bounds";

export const boundRegex = /(\d+(?:\.\d+)?)(px|rem|em)/

export type TickOrientation = {
  bounds: BoundsValid,
  boundElement?: SVGHTMLElement,
  rotationDirection?: 'clockwise' | 'counterclockwise'
  orientation: ('horizontal' | 'vertical' | 'transition')[]
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

