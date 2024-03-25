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
export function throttle<T extends (...args: any[]) => K, K>(func: T, delayMs: number) {
  return {
    lastTime: 0,
    func: function (...args: any[]) {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastTime >= delayMs) {
        // console.trace('Func Works!?', currentTime - this.lastTime)
        func.apply(this, args);
        this.lastTime = currentTime;
      }
    }
  }
}

export function addRawSVGToSelection(selection: Selection, rawSVG: string) {
  const parser = new DOMParser()
  const svgDocument = parser.parseFromString(rawSVG, 'image/svg+xml')
  const svgElement = svgDocument.documentElement.cloneNode(true) as SVGSVGElement
  selection.selectAll('svg')
    .data([svgElement])
    .join(enter => enter.append(() => enter.datum()))
  return selection
}
