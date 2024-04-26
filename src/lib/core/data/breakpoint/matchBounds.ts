import {LengthDimension, SVGHTMLGroupingElement} from "../../constants/types";

import {BreakpointsValid} from "./breakpoint-validation";
import {convertToPx} from "../../utilities/dom/units";

export function indexFromBounds(element: SVGHTMLGroupingElement, bounds: BreakpointsValid, dimension: LengthDimension) {
  const rect = element.getBoundingClientRect()
  const referenceValue = rect[dimension]
  if (bounds.values.length === 0) return 0
  for (let i = 0; i < bounds.values.length; i++) {
    if (referenceValue < convertToPx(element, bounds.values[i],  bounds.unit)) return i
  }
  return bounds.values.length
}

