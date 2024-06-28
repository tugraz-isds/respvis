export type Extrema = {
  minimum: number
  maximum: number
}

export function isExtrema(args: any): args is Extrema {
  return typeof args.minimum === 'number' && typeof args.maximum === 'number'
}
