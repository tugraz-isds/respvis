import {
  CSSBreakPointLengthUnit,
  isCSSBreakpointLengthValue,
  LengthDimension,
  SVGGroupingElement,
  SVGHTMLGroupingElement,
  UnitValue
} from "../../constants/types";
import {indexFromBounds} from "./matchBounds";
import {elementFromSelection} from "../../utilities/d3/util";
import {Selection} from "d3";
import {BreakpointsValid, getActiveBreakpoints} from "./breakpoint-validation";
import {defaultLayoutIndex, pxLowerLimit, pxUpperLimit} from "../../constants/other";

export type WithBreakpoints = {
  breakPoints: LayoutBreakpoints
}
export type LayoutBreakpoints = Record<LengthDimension, BreakpointsValid>
type LayoutState = {
  index: number,
  preBreakValue: UnitValue<CSSBreakPointLengthUnit>,
  postBreakValue: UnitValue<CSSBreakPointLengthUnit>
}
export type LayoutStates = Record<LengthDimension, LayoutState> & {
}

export function updateCSSForSelection<T extends SVGHTMLGroupingElement, D extends WithBreakpoints>(selection: Selection<T, D>) {
  const element = elementFromSelection(selection)
  const chartBaseValid = selection.data()[0]
  updateBreakpointStatesInCSS(element, chartBaseValid.breakPoints)
}

export function getLayoutStateFromCSS(element: SVGGroupingElement, dimension: LengthDimension) : LayoutState {
  const indexValueQueried = parseInt(getComputedStyle(element).getPropertyValue(`--layout-${dimension}`))
  const preBreakValueQueried = getComputedStyle(element).getPropertyValue(`--layout-${dimension}-pre-breakpoint`)
  const postBreakValueQueried = getComputedStyle(element).getPropertyValue(`--layout-${dimension}-post-breakpoint`)
  return {
    index: !isNaN(indexValueQueried) ? indexValueQueried : defaultLayoutIndex,
    postBreakValue: isCSSBreakpointLengthValue(postBreakValueQueried) ? postBreakValueQueried : pxUpperLimit,
    preBreakValue: isCSSBreakpointLengthValue(preBreakValueQueried) ? preBreakValueQueried : pxLowerLimit,
  }
}

export function getLayoutStatesFromCSS(element: SVGGroupingElement): LayoutStates {
  return {
    width: getLayoutStateFromCSS(element, 'width'),
    height: getLayoutStateFromCSS(element, 'height')
  }
}

//TODO: naming of custom css properties

export function getComputedBreakpointValues(element: SVGGroupingElement, breakpoints: LayoutBreakpoints) {
  getTransformedBreakpoints(element, breakpoints.width, 'width')
  getTransformedBreakpoints(element, breakpoints.height, 'height')
}

export function updateBreakpointStatesInCSS(element: SVGHTMLGroupingElement, layoutBreakpoints: LayoutBreakpoints) {
  for (const k in layoutBreakpoints) {
    if (!layoutBreakpoints.hasOwnProperty(k)) continue
    const dimension = k as LengthDimension
    const breakpoints = layoutBreakpoints[dimension]
    const boundsWidthTransformed = getTransformedBreakpoints(element, breakpoints, dimension)
    const layoutWidthIndex = indexFromBounds(element, boundsWidthTransformed, dimension)
    const [preBreak, postBreak] = getActiveBreakpoints(layoutWidthIndex, breakpoints)
    element.style.setProperty(`--layout-${dimension}`, layoutWidthIndex.toString())
    element.style.setProperty(`--layout-${dimension}-pre-breakpoint`, preBreak)
    element.style.setProperty(`--layout-${dimension}-post-breakpoint`, postBreak)
  }
}

function getTransformedBreakpoints(element: SVGHTMLGroupingElement, breakpoint: BreakpointsValid, dimension: LengthDimension): BreakpointsValid {
  const transformFactorWidth = parseFloat(getComputedStyle(element)
    .getPropertyValue(`--layout-${dimension}-factor`))
  const transformFactorWidthOffset = parseFloat(getComputedStyle(element)
    .getPropertyValue(`--layout-${dimension}-factor-offset`))

  const transformedValues = breakpoint.values.map(value => {
    const transformFactorWidthValid = isNaN(transformFactorWidth) ? 1 : transformFactorWidth
    const transformFactorWidthOffsetValid = isNaN(transformFactorWidthOffset) ? 0 : transformFactorWidthOffset
    return value * transformFactorWidthValid + transformFactorWidthOffsetValid
  })
  return {
    ...breakpoint,
    values: transformedValues,
  }
}
