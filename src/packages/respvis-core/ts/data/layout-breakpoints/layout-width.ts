import {LengthDimension, SVGHTMLElement} from "../../constants/types";
import {defaultLayoutIndex} from "../../constants";

export function getLayoutWidthIndicesFromCSS(element: SVGHTMLElement) {
  return {
    width: getLayoutWidthIndexFromCSS(element, 'width'),
    height: getLayoutWidthIndexFromCSS(element, 'height')
  }
}

export function getLayoutWidthIndexFromCSS(element: SVGHTMLElement, dimension: LengthDimension) {
  const indexValueQueried = parseInt(getComputedStyle(element).getPropertyValue(`--layout-${dimension}`))
  return !isNaN(indexValueQueried) ? indexValueQueried : defaultLayoutIndex
}
