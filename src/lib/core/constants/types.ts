export type SVGHTMLElement = SVGGElement | HTMLElement

export const LengthDimensions = ['width', 'height'] as const
export type LengthDimension = typeof LengthDimensions[number]


export type CSSLengthUnit = 'px' | 'rem' | 'em'
export type CSSLengthValue = `${number}${CSSLengthUnit}`
export const boundRegex = /(\d+(?:\.\d+)?)(px|rem|em)/
export function isCSSLengthValue(value: any): value is CSSLengthValue {
  return value.match(boundRegex) !== null
}

export type ChartType = 'point' | 'bar' | 'line'

export type Orientation = 'horizontal' | 'vertical'

export type RotationDirection = 'clockwise' | 'counterclockwise'


export type SeriesKey = `s-${number}`
export type CategoryKey = `c-${number}`
export type IndividualKey = `i-${number}`


// util types

export type ToArray<T> = T extends any ? T[] : never;
