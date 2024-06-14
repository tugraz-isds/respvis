import {LengthDimension, SVGHTMLGroupingElement} from "../../constants";
import {getLayoutWidthIndex} from "../breakpoints/layout-width";
import {Breakpoints, getActiveBreakpoints} from "../breakpoints/breakpoints";
import {Selection} from "d3";
import {elementFromSelection} from "../../utilities";
import {LayoutBreakpoints} from "./index";

type WithBreakpoints = {
  breakpoints: LayoutBreakpoints
}

export function updateBreakpointStateForSelection<T extends SVGHTMLGroupingElement, D extends WithBreakpoints>(selection: Selection<T, D>) {
  const element = elementFromSelection(selection)
  const chartBaseValid = selection.data()[0]
  updateBreakpointState(element, chartBaseValid.breakpoints)
}

export function updateBreakpointState(element: SVGHTMLGroupingElement, layoutBreakpoints: LayoutBreakpoints) {
  for (const k in layoutBreakpoints) {
    if (!layoutBreakpoints.hasOwnProperty(k)) continue
    const dimension = k as LengthDimension
    const breakpoints = layoutBreakpoints[dimension]
    const boundsWidthTransformed = getBreakpointsTransformed(element, breakpoints, dimension)
    const layoutWidthIndex = getLayoutWidthIndex(element, boundsWidthTransformed, dimension)
    const [preBreak, postBreak] = getActiveBreakpoints(layoutWidthIndex, breakpoints)
    element.style.setProperty(`--layout-${dimension}`, layoutWidthIndex.toString())
    element.style.setProperty(`--layout-${dimension}-pre-breakpoint`, preBreak)
    element.style.setProperty(`--layout-${dimension}-post-breakpoint`, postBreak)
  }
}

function getBreakpointsTransformed(element: SVGHTMLGroupingElement, breakpoint: Breakpoints, dimension: LengthDimension): Breakpoints {
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
