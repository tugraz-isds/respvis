import {CSSLength, LengthDimension, SVGHTMLElement} from "../../constants/types";
import {indexFromBounds} from "./matchBounds";
import {elementFromSelection} from "../../utilities/d3/util";
import {Selection} from "d3";


export type BreakpointsArgs = {
  values: number[],
  unit: CSSLength
}
export type BreakpointsValid = Required<BreakpointsArgs>

export function validateBreakpoints(args?: BreakpointsArgs): BreakpointsValid {
  return {
    unit: args ? args.unit : 'rem',
    values: args ? args.values : [],
  }
}

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
  const width = Number(element.style.getPropertyValue('--transform-index-width'))
  const height = Number(element.style.getPropertyValue('--transform-index-height'))
  return {width, height}
}

//TODO: naming of custom css properties
export function updateBreakpointStatesInCSS(element: SVGHTMLElement, breakpoints: LayoutBreakpoints) {
  const boundsWidthTransformed = getTransformedBreakpoints(element, breakpoints.width, 'width')
  const widthState = indexFromBounds(element, boundsWidthTransformed, 'width')
  element.style.setProperty('--transform-index-width',  widthState.toString())

  const boundsHeightTransformed = getTransformedBreakpoints(element, breakpoints.height, 'height')
  const heightState = indexFromBounds(element, boundsHeightTransformed, 'height')
  element.style.setProperty('--transform-index-height',  heightState.toString())
}

function getTransformedBreakpoints(element: SVGHTMLElement, breakpoint: BreakpointsValid, dimension: LengthDimension): BreakpointsValid {
  const transformFactorWidth = Number(getComputedStyle(element).getPropertyValue(`--transform-factor-${dimension}`))
  const transformFactorWidthOffset = Number(getComputedStyle(element).getPropertyValue(`--transform-factor-${dimension}-offset`))

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
