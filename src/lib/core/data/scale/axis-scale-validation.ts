import {
  AxisDomain, ScaleBand,
  scaleBand,
  ScaleLinear,
  scaleLinear,
  ScaleTime,
  scaleTime,
} from 'd3';

type ToArray<T> = T extends any ? T[] : never;

export type AxisScale<Domain extends AxisDomain> =
  Domain extends Date ? ScaleTime<number, number, never> :
  Domain extends number ? ScaleLinear<Domain, number, never> :
  Domain extends string ? ScaleBand<Domain> : never

type AxisScaleArgs = {
  values: ToArray<AxisDomain>,
  scale?: AxisScale<AxisDomain>
}

export function axisScaleValidation(axisScaleArgs: AxisScaleArgs): AxisScale<AxisDomain> {
  //Cases: number | string | Date | { valueOf(): number}
  const {values, scale} = axisScaleArgs
  if (scale) return scale

  let scaleValid: AxisScale<number> = scaleLinear().domain([0, 1]).nice()
  if (values.length <= 0) return scaleValid

  if (isDateArray(values)) {
    return scaleTime(values, [0, 600]).nice()
  }

  if (isNumberArray(values) || hasValueOf(values)) {
    const valuesNum = isNumberArray(values) ?
      values.map(value => Number(value)) :
      values.map(value => value.valueOf())
    const extent = [Math.min(...valuesNum), Math.max(...valuesNum)]
    return scaleLinear().domain(extent).nice()
  }

  return scaleBand([0, 600]).domain(values).padding(0.1)
}

function isNumberArray(arr: any[]): arr is number[] {
  return arr.length > 0 && typeof arr[0] === 'number'
}

function isStringArray(arr: any[]): arr is string[] {
  return arr.length > 0 && typeof arr[0] === 'string'
}

function isDateArray(arr: any[]): arr is Date[] {
  return arr.length > 0 && arr[0] instanceof Date
}

function hasValueOf(arr: any[]): arr is { valueOf: () => number }[] {
  return arr.length > 0 && typeof arr[0].valueOf === "number"
}
