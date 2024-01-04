import {CSSLength} from "./resizing/types";

export function convertToPx(element: Element, value: number, unit: CSSLength) {
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
