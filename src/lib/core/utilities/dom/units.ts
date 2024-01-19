import {boundRegex, CSSLengthValue, CSSLengthUnit} from "../../constants/types";
import {ErrorMessages} from "../error";

export function cssLengthInPx(length: CSSLengthValue, element?: Element) {
  const match = length.match(boundRegex);
  if (!match) return 0
  const [, value, unit] = match as [any, number, CSSLengthUnit]
  if (unit === 'px') return value
  if (unit === 'rem') return value * parseFloat(getComputedStyle(document.documentElement).fontSize)
  if (unit === 'em' && element) return value * parseFloat(getComputedStyle(element).fontSize)
  if (unit === 'em' && !element) throw new Error(ErrorMessages.evaluatingEmWithoutElement)
  throw new Error(ErrorMessages.evaluatingEmWithoutElement)
}

export function convertToPx(element: Element, value: number, unit: CSSLengthUnit) {
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

