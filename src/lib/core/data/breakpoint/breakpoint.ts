import {LengthDimension, SVGHTMLElement} from "../../constants/types";
import {indexFromBounds} from "./matchBounds";
import {elementFromSelection} from "../../utilities/d3/util";
import {Selection} from "d3";
import {BreakpointsValid} from "./breakpoint-validation";


export type WithBreakpoints = {
  bounds: LayoutBreakpoints
}
export type LayoutBreakpoints = {
  width: BreakpointsValid,
  height: BreakpointsValid,
}
export type LayoutIndices = {
  [Property in keyof LayoutBreakpoints]: number;
}

export function updateCSSForSelection<T extends SVGHTMLElement, D extends WithBreakpoints>(selection: Selection<T, D>) {
  const element = elementFromSelection(selection)
  const chartBaseValid = selection.data()[0]
  updateBreakpointStatesInCSS(element, chartBaseValid.bounds)
}

export function getBreakpointStatesFromCSS(element: SVGHTMLElement): LayoutIndices {
  const width = Number(element.style.getPropertyValue('--layout-width'))
  const height = Number(element.style.getPropertyValue('--layout-height'))
  return {width, height}
}

//TODO: naming of custom css properties

export function getComputedBreakpointValues(element: SVGHTMLElement, breakpoints: LayoutBreakpoints) {
  const boundsWidthTransformed = getTransformedBreakpoints(element, breakpoints.width, 'width')
  const boundsHeightTransformed = getTransformedBreakpoints(element, breakpoints.height, 'height')
}

export function updateBreakpointStatesInCSS(element: SVGHTMLElement, breakpoints: LayoutBreakpoints) {
  const boundsWidthTransformed = getTransformedBreakpoints(element, breakpoints.width, 'width')
  const widthState = indexFromBounds(element, boundsWidthTransformed, 'width')
  element.style.setProperty('--layout-width',  widthState.toString())

  const boundsHeightTransformed = getTransformedBreakpoints(element, breakpoints.height, 'height')
  const heightState = indexFromBounds(element, boundsHeightTransformed, 'height')
  element.style.setProperty('--layout-height',  heightState.toString())
}

function getTransformedBreakpoints(element: SVGHTMLElement, breakpoint: BreakpointsValid, dimension: LengthDimension): BreakpointsValid {
  const transformFactorWidth = parseFloat(getComputedStyle(element).getPropertyValue(`--layout-${dimension}-factor`))
  const transformFactorWidthOffset = parseFloat(getComputedStyle(element).getPropertyValue(`--layout-${dimension}-factor-offset`))

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
