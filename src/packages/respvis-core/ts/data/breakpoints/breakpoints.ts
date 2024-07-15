import {CSSBreakpointLengthUnit, CSSLengthValue, LengthDimension, SVGHTMLElement,} from "../../constants/types";
import {defaultLayoutIndex, pxUpperLimit} from "../../constants/other";
import {cssLengthInPx} from "../../utilities";

export type BreakpointsUserArgs = {
  values: readonly number[],
  unit: CSSBreakpointLengthUnit
}
export type BreakpointsArgs = BreakpointsUserArgs & {
  dimension?: LengthDimension
}

export class Breakpoints {
  values: readonly number[]
  unit: CSSBreakpointLengthUnit
  dimension: LengthDimension
  constructor(args?: BreakpointsArgs) {
    this.values = args ? args.values: []
    this.unit = args ? args.unit: 'rem'
    this.dimension = args?.dimension ?? 'width'
  }

  getLengthAt(breakPointIndex: number, defaultMinWidth: string, defaultMaxWidth: string) {
    if (breakPointIndex < 0) return defaultMinWidth
    if (breakPointIndex >= this.values.length) return defaultMaxWidth
    return `${this.values[breakPointIndex]}${this.unit}`
  }

  getSurroundingLengths(layoutWidthIndex: number) {
    return [
      this.getLengthAt(layoutWidthIndex - 1, `0${this.unit}`, pxUpperLimit),
      this.getLengthAt(layoutWidthIndex, `0${this.unit}`, pxUpperLimit)
    ]
  }

  getCurrentLayoutWidthIndex(element: SVGHTMLElement) {
    const rect = element.getBoundingClientRect()
    const referenceValue = rect[this.dimension]
    if (this.values.length === 0) return 0
    for (let i = 0; i < this.values.length; i++) {
      const cssLength = (this.values[i].toString() + this.unit.toString()) as CSSLengthValue
      if (referenceValue < cssLengthInPx(cssLength, element)) return i
    }
    return this.values.length
  }

  getCurrentLayoutWidthIndexFromCSS(element: SVGHTMLElement) {
    const indexValueQueried = parseInt(getComputedStyle(element)
      .getPropertyValue(`--layout-${this.dimension}`))
    return !isNaN(indexValueQueried) ? indexValueQueried : defaultLayoutIndex
  }

  getCSSFactors(element: SVGHTMLElement) {
    return {
      factor: parseFloat(getComputedStyle(element)
        .getPropertyValue(`--layout-${this.dimension}-factor`)),
      offset: parseFloat(getComputedStyle(element)
        .getPropertyValue(`--layout-${this.dimension}-factor-offset`))
    }
  }

  getTransformed(element: SVGHTMLElement): Breakpoints {
    const {factor, offset} = this.getCSSFactors(element)
    return new Breakpoints({
      dimension: this.dimension,
      unit: this.unit,
      values: this.values.map(value => {
        const factorValid = isNaN(factor) ? 1 : factor
        const factorOffsetValid = isNaN(offset) ? 0 : offset
        return value * factorValid + factorOffsetValid
      })
    })
  }

  updateLayoutCSSVars(element: SVGHTMLElement) {
    const transformedBreakpoints = this.getTransformed(element)
    const layoutWidthIndex = transformedBreakpoints.getCurrentLayoutWidthIndex(element)
    const [preBreakPointLength, postBreakPointLength] = transformedBreakpoints.getSurroundingLengths(layoutWidthIndex)

    element.style.setProperty(`--layout-${this.dimension}`, layoutWidthIndex.toString())
    element.style.setProperty(`--layout-${this.dimension}-pre-breakpoint`, preBreakPointLength)
    element.style.setProperty(`--layout-${this.dimension}-post-breakpoint`, postBreakPointLength)
  }
}
