import {LengthDimension, SVGHTMLElement} from "../../constants/types";
import {defaultLayoutIndex} from "../../constants";

export function getLayoutWidthIndexFromCSS(element: SVGHTMLElement, dimension: LengthDimension) {
  const indexValueQueried = parseInt(getComputedStyle(element).getPropertyValue(`--layout-${dimension}`))
  return !isNaN(indexValueQueried) ? indexValueQueried : defaultLayoutIndex
}
