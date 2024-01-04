export type SVGHTMLElement = SVGGElement | HTMLElement

export type LengthDimension = 'width' | 'height'
export type CSSLength = 'px' | 'rem' | 'em'

type TupleBoundArg<T> = {
  tuples: [index: number, value: T][]
  dependentOn: LengthDimension
}

export type BoundArg<T> = TupleBoundArg<T> | T

export function isTupleBoundArg<T>(arg: BoundArg<T>): arg is TupleBoundArg<T> {
  return typeof arg === 'object' && arg !== null && 'tuples' in arg && 'dependentOn' in arg;
}


export type Bounds = {
  values: number[],
  unit: CSSLength
}
