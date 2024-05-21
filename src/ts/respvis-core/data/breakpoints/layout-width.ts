import {
  CSSBreakpointLengthUnit,
  isCSSBreakpointLengthValue,
  LengthDimension,
  SVGGroupingElement,
  SVGHTMLGroupingElement,
  UnitValue
} from "../../constants/types";
import {Breakpoints} from "./breakpoints-validation";
import {convertToPx} from "../../utilities/dom/units";
import {defaultLayoutIndex, pxLowerLimit, pxUpperLimit} from "respvis-core/constants";

type LayoutWidth = {
  index: number,
  preBreakValue: UnitValue<CSSBreakpointLengthUnit>,
  postBreakValue: UnitValue<CSSBreakpointLengthUnit>
}
export type LayoutWidths = Record<LengthDimension, LayoutWidth>

export function getLayoutWidthIndex(element: SVGHTMLGroupingElement, breakpoints: Breakpoints, dimension: LengthDimension) {
  const rect = element.getBoundingClientRect()
  const referenceValue = rect[dimension]
  if (breakpoints.values.length === 0) return 0
  for (let i = 0; i < breakpoints.values.length; i++) {
    if (referenceValue < convertToPx(element, breakpoints.values[i],  breakpoints.unit)) return i
  }
  return breakpoints.values.length
}

export function getLayoutWidths(element: SVGGroupingElement): LayoutWidths {
  return {
    width: getLayoutWidth(element, 'width'),
    height: getLayoutWidth(element, 'height')
  }
}

export function getLayoutWidth(element: SVGGroupingElement, dimension: LengthDimension): LayoutWidth {
  const indexValueQueried = parseInt(getComputedStyle(element).getPropertyValue(`--layout-${dimension}`))
  const preBreakValueQueried = getComputedStyle(element).getPropertyValue(`--layout-${dimension}-pre-breakpoint`)
  const postBreakValueQueried = getComputedStyle(element).getPropertyValue(`--layout-${dimension}-post-breakpoint`)
  return {
    index: !isNaN(indexValueQueried) ? indexValueQueried : defaultLayoutIndex,
    postBreakValue: isCSSBreakpointLengthValue(postBreakValueQueried) ? postBreakValueQueried : pxUpperLimit,
    preBreakValue: isCSSBreakpointLengthValue(preBreakValueQueried) ? preBreakValueQueried : pxLowerLimit,
  }
}
