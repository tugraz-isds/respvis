import {CSSLength, LengthDimension, SVGHTMLElement} from "../../constants/types";
import {indexFromBounds} from "./matchBounds";
import {elementFromSelection} from "../d3/util";
import {Selection} from "d3";


export type BoundsArgs = {
  values: number[],
  unit: CSSLength
}
export type BoundsValid = Required<BoundsArgs>

export function validateBounds(args?: BoundsArgs): BoundsValid {
  return {
    unit: args ? args.unit : 'rem',
    values: args ? args.values : [],
  }
}


export type WithBounds = {
  bounds: LengthDimensionBounds
}
export type LengthDimensionBounds = {
  width: BoundsValid,
  height: BoundsValid,
}
export type LenghtDimensionIndices = {
  [Property in keyof LengthDimensionBounds]: number;
}

export function updateCSSForSelection<T extends SVGHTMLElement, D extends WithBounds>(selection: Selection<T, D>) {
  const element = elementFromSelection(selection)
  const chartBaseValid = selection.data()[0]
  updateBoundStateInCSS(element, chartBaseValid.bounds)
}

export function getBoundStateFromCSS(element: SVGHTMLElement): LenghtDimensionIndices {
  const width = Number(element.style.getPropertyValue('--transform-index-width'))
  const height = Number(element.style.getPropertyValue('--transform-index-height'))
  return {width, height}
}

//TODO: naming of custom css properties
export function updateBoundStateInCSS(element: SVGHTMLElement, bounds: LengthDimensionBounds) {
  const boundsWidthTransformed = transformBoundsWithCSSVars(element, bounds.width, 'width')
  const widthState = indexFromBounds(element, boundsWidthTransformed, 'width')
  element.style.setProperty('--transform-index-width',  widthState.toString())

  const boundsHeightTransformed = transformBoundsWithCSSVars(element, bounds.height, 'height')
  const heightState = indexFromBounds(element, boundsHeightTransformed, 'height')
  element.style.setProperty('--transform-index-height',  heightState.toString())
}

function transformBoundsWithCSSVars(element: SVGHTMLElement, bounds: BoundsValid, dimension: LengthDimension): BoundsValid {
  const transformFactorWidth = Number(getComputedStyle(element).getPropertyValue(`--transform-factor-${dimension}`))
  const transformFactorWidthOffset = Number(getComputedStyle(element).getPropertyValue(`--transform-factor-${dimension}-offset`))

  const transformedValues = bounds.values.map(value => {
    const transformFactorWidthValid = isNaN(transformFactorWidth) ? 1 : transformFactorWidth
    const transformFactorWidthOffsetValid = isNaN(transformFactorWidthOffset) ? 0 : transformFactorWidthOffset
    return value * transformFactorWidthValid + transformFactorWidthOffsetValid
  })
  return {
    ...bounds,
    values: transformedValues,
  }
}
