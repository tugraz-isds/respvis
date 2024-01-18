import {LengthDimension, SVGHTMLElement} from "../../constants/types";
import {convertToPx} from "../../utilities/length";

import {BreakpointsValid} from "./breakpoint-validation";

export const boundRegex = /(\d+(?:\.\d+)?)(px|rem|em)/

export function indexFromBounds(element: SVGHTMLElement, bounds: BreakpointsValid, dimension: LengthDimension) {
  const rect = element.getBoundingClientRect()
  const referenceValue = rect[dimension]
  if (bounds.values.length === 0) return 0
  for (let i = 0; i < bounds.values.length; i++) {
    if (referenceValue < convertToPx(element, bounds.values[i],  bounds.unit)) return i
  }
  return bounds.values.length
}

