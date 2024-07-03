import {
  CSSBreakpointLengthUnit,
  CSSLengthRegex,
  CSSLengthUnit,
  LengthDimension,
  UnitValue
} from "../../constants/types";
import {ErrorMessages} from "../../constants/error";

//TODO: maybe add additional units like ch, vh, etc.
// export function cssLengthInPx(length: UnitValue<CSSAbsoluteLengthUnit>): number
// export function cssLengthInPx(length: UnitValue<CSSEMUnit>, element: Element): number
// export function cssLengthInPx(length: UnitValue<CSSPERUnit>, element: Element, dim: LengthDimension): number
export function cssLengthInPx(length: UnitValue<CSSLengthUnit>, element?: Element, dim?: LengthDimension) {
  const match = length.match(CSSLengthRegex)
  if (!match) return 0
  const [, value, unit] = match as [any, number | string, CSSLengthUnit]
  const valueNumber = typeof value === 'string' ? parseFloat(value) : value
  if (unit === 'px') return valueNumber
  if (unit === 'rem') return valueNumber * parseFloat(getComputedStyle(document.documentElement).fontSize)
  if (unit === 'em' && element) return valueNumber * parseFloat(getComputedStyle(element).fontSize)
  if (unit === 'em' && !element) throw new Error(ErrorMessages.evaluatingCSSUnitError)
  if(unit === '%' && element && dim) return valueNumber / 100 * element.getBoundingClientRect()[dim]
  if(unit === '%' && !(element && dim)) throw new Error(ErrorMessages.evaluatingCSSUnitError)
  throw new Error(ErrorMessages.evaluatingCSSUnitError)
}

export function convertToPx(element: Element, value: number, unit: CSSBreakpointLengthUnit) {
  if (unit === 'px') {
    return value;
  } else if (unit === 'rem') {
    return value * parseFloat(getComputedStyle(document.documentElement).fontSize);
  } else if (unit === 'em') {
    return value * parseFloat(getComputedStyle(element).fontSize);
  } else {
    throw new Error(`Invalid unit: ${unit}`);
  }
}

