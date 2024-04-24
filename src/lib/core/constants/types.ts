export type SVGHTMLElement = SVGGElement | HTMLElement
export type SVGGroupingElement = SVGSVGElement | SVGGElement | SVGClipPathElement
export type SVGHTMLGroupingElement = SVGGroupingElement | HTMLElement

export const LengthDimensions = ['width', 'height'] as const
export type LengthDimension = typeof LengthDimensions[number]


export type CSSPXUnit = 'px'
export type CSSREMUnit = 'rem'
export type CSSEMUnit = 'em'
export type CSSPERUnit = '%'
export type CSSAbsoluteLengthUnit = CSSPXUnit | CSSREMUnit
export type CSSRelativeLengthUnit = CSSEMUnit | CSSPERUnit
export type CSSBreakPointLengthUnit = CSSAbsoluteLengthUnit | CSSEMUnit

export type UnitValue<Unit extends string> = `${number}${Unit}`

export const CSSBreakpointLengthRegex = /(\d+(?:\.\d+)?)(px|rem|em)/
export function isCSSBreakpointLengthValue(value: any): value is UnitValue<CSSBreakPointLengthUnit> {
  return value.match(CSSBreakpointLengthRegex) !== null
}

export type CSSLengthUnit = CSSAbsoluteLengthUnit | CSSRelativeLengthUnit
export type CSSLengthValue = `${number}${CSSLengthUnit}`

export const CSSLengthRegex = /(\d+(?:\.\d+)?)(px|rem|em|%)/
export function isCSSLengthValue(value: any): value is UnitValue<CSSLengthUnit> {
  return value.match(CSSLengthRegex) !== null
}




export type CartesianChartType = 'point' | 'bar' | 'line'

export type ChartType = CartesianChartType | 'parcoord'

export type BarSeriesType = 'standard' | 'stacked' | 'grouped'

export type Orientation = 'horizontal' | 'vertical'

export type ScaledValueTag = 'categorical' | 'linear' | 'date'

export type TextAnchor = 'start' | 'end' | 'middle'
export type Sign = 'positive' | 'negative'



export type KeyType = 'series' | 'axis' | 'category' | 'individual'
export type AxisKey = `a-${number}`
export type SeriesKey = `s-${number}`
export type CategoryKey = `c-${number}`
export type IndividualKey = `i-${number}`

export type AxisType = 'x' | 'y'
export type AxisLayout = 'bottom' | 'left'
export type AxisOrientation = AxisLayout | 'top' | 'right'

export type ActiveKeyMap = {[p: string]: boolean}

export const categoryRegex = /^c-\d+$/



// util types

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type ToArray<T> = T extends any ? T[] : never;


type AllInstanceKeys<T> = T extends { new(...args: any[]): infer I } ? keyof I : never;
// Filter out methods and protected properties
export type PropertiesOnly<T> = {
  [K in AllInstanceKeys<T>]: T[K] extends Function | number ? never : K extends keyof T ? T[K] : never;
}[AllInstanceKeys<T>];
