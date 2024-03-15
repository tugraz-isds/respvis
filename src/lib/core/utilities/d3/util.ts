import {ErrorMessages} from "../error";
import {BaseType, Selection} from "d3";

export function elementFromSelection<T extends BaseType>(selection?: Selection<T>): T {
  const element = selection?.node()
  if (!element) throw new Error(ErrorMessages.elementNotExisting)
  return element
}

export function classesForSelection(classes: string[], leadingSpace = false) {
  const selector = classes.map(currentClass => '.' + currentClass).join('')
  const names = classes.map(currentClass => ' ' + currentClass).join('')
  if (!leadingSpace) names.trimStart()
  return {selector, names}
}

// type WrapperFunction<T extends (...args: any[]) => K, K> = (func: T, delay: number) => T
export function throttle<T extends (...args: any[]) => K, K>(func: T, delayMs: number): T {
  let lastTime = 0;
  return function (...args) {
    const currentTime = new Date().getTime();
    if (currentTime - lastTime >= delayMs) {
      func.apply(this, args);
      lastTime = currentTime;
    }
  } as T
}

export function addRawSVGToSelection(selection: Selection, rawSVG: string) {
  const parser = new DOMParser()
  const svgDocument = parser.parseFromString(rawSVG, 'image/svg+xml')
  const svgElement = svgDocument.documentElement.cloneNode(true) as SVGSVGElement
  selection.selectAll('svg')
    .data([null])
    .join(enter => enter.append(() => svgElement))
  return selection
}
