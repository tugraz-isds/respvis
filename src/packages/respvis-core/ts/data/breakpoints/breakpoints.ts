import {CSSBreakpointLengthUnit, LengthDimension, SVGHTMLElement, UnitValue} from "../../constants/types";
import {defaultLayoutIndex, pxUpperLimit} from "../../constants/other";
import {convertToPx} from "respvis-core";

export type BreakpointsUserArgs = {
  values: readonly number[],
  unit: CSSBreakpointLengthUnit
}
export type BreakpointsArgs = BreakpointsUserArgs & {
  dimension?: LengthDimension
}

export function getActiveBreakpoints(layoutWidthIndex: number, breakpoints: Breakpoints)
  : [UnitValue<CSSBreakpointLengthUnit>, UnitValue<CSSBreakpointLengthUnit>] {
  const {unit, values} = breakpoints
  const preBreak = `${layoutWidthIndex > 0 ? values[layoutWidthIndex - 1] : 0}${unit}` as const
  const postBreak = layoutWidthIndex < values.length ? `${values[layoutWidthIndex]}${unit}` as const : pxUpperLimit
  return [preBreak, postBreak]
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

  getLengthAt(breakPointIndex: number) {
    if (breakPointIndex < 0) return `0${this.unit}`
    if (breakPointIndex > this.values.length) return pxUpperLimit
    if (this.values[breakPointIndex] === undefined) return undefined
    return `${this.values[breakPointIndex]}${this.unit}`
  }

  getSurroundingLengths(layoutWidthIndex: number) {
    return [
      this.getLengthAt(layoutWidthIndex - 1) ?? `0${this.unit}`,
      this.getLengthAt(layoutWidthIndex) ?? pxUpperLimit,
    ]
  }

  getCurrentLayoutWidthIndex(element: SVGHTMLElement) {
    const rect = element.getBoundingClientRect()
    const referenceValue = rect[this.dimension]
    if (this.values.length === 0) return 0
    for (let i = 0; i < this.values.length; i++) {
      if (referenceValue < convertToPx(element, this.values[i],  this.unit)) return i
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
    // if (!layoutBreakpoints.hasOwnProperty(k)) continue

    const transformedBreakpoints = this.getTransformed(element)
    const layoutWidthIndex = transformedBreakpoints.getCurrentLayoutWidthIndex(element)
    const [preBreakPointLength, postBreakPointLength] = transformedBreakpoints.getSurroundingLengths(layoutWidthIndex)

    element.style.setProperty(`--layout-${this.dimension}`, layoutWidthIndex.toString())
    element.style.setProperty(`--layout-${this.dimension}-pre-breakpoint`, preBreakPointLength)
    element.style.setProperty(`--layout-${this.dimension}-post-breakpoint`, postBreakPointLength)
  }
}
