import {AxisDomain, scaleBand, scaleLinear, scaleTime,} from 'd3';
import {ScaledValuesArg, ScaledValuesValid} from "./scaled-values";
import {ErrorMessages} from "../../utilities/error";

export type AxisDomainRV = Extract<AxisDomain, number | string | Date>
export type AxisScaledValuesArg = ScaledValuesArg<AxisDomainRV>
export type AxisScaledValuesValid = ScaledValuesValid<AxisDomainRV>

export function axisScaledValuesValidation(axisScaleArgs: AxisScaledValuesArg): AxisScaledValuesValid {
  //Cases: number | string | Date | { valueOf(): number}
  const {values, scale} = axisScaleArgs
  if (scale) return {values, scale} as AxisScaledValuesValid //TODO: additional check with error message

  if (values.length <= 0) throw new Error(ErrorMessages.responsiveValueHasNoValues)

  if (isDateArray(values)) {
    return {values, scale: scaleTime(values, [0, 600]).nice()}
  }

  if (isNumberArray(values) || hasValueOf(values)) {
    const valuesNum = isNumberArray(values) ?
      values.map(value => Number(value)) :
      values.map(value => parseFloat(value.valueOf()))
    const extent = [Math.min(...valuesNum), Math.max(...valuesNum)]
    return {values: valuesNum, scale: scaleLinear().domain(extent).nice()}
  }

  return {values, scale: scaleBand([0, 600]).domain(values).padding(0.1)}
}

export function isNumberArray(arr: any[]): arr is number[] {
  return arr.length > 0 && typeof arr[0] === 'number'
}

export function isStringArray(arr: any[]): arr is string[] {
  return arr.length > 0 && typeof arr[0] === 'string'
}

function isDateArray(arr: any[]): arr is Date[] {
  return arr.length > 0 && arr[0] instanceof Date
}

function hasValueOf(arr: any[]): arr is { valueOf: () => number }[] {
  return arr.length > 0 && typeof arr[0].valueOf === "number"
}
