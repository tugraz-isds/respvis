import {AxisDomain} from 'd3';
import {isScaleCategory, isScaleLinear, isScaleTime, ScaledValuesUserArgs} from "./scaled-values";
import {ErrorMessages} from "../../utilities/error";
import {AxisKey} from "../../constants/types";
import {ScaledValuesDate} from "./scaled-values-date";
import {ScaledValuesLinear} from "./scaled-values-linear";
import {ScaledValuesCategorical} from "./scaled-values-categorical";
import {ScaledValues, ScaledValuesBase} from "./scaled-values-base";

export type AxisDomainRV = Extract<AxisDomain, number | string | Date>

export function validateScaledValuesAxis(axisScaleArgs: ScaledValuesUserArgs<AxisDomainRV>, axisKey: AxisKey): ScaledValues {
  const {values, scale} = axisScaleArgs

  if (values.length <= 0) throw new Error(ErrorMessages.responsiveValueHasNoValues)

  if (isDateArray(values)) {
    if (scale && !isScaleTime(scale)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    return new ScaledValuesDate({values, scale, parentKey: axisKey})
  }

  if (isNumberArray(values) || hasValueOf(values)) {
    if (scale && !isScaleLinear(scale)) {
      throw new Error(ErrorMessages.invalidScaledValuesCombination)
    }
    const valuesNum = isNumberArray(values) ?
      values.map(value => Number(value)) :
      values.map(value => parseFloat(value.valueOf()))
    return new ScaledValuesLinear({values: valuesNum, scale, parentKey: axisKey})
  }

  if (scale && !isScaleCategory(scale)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
  return new ScaledValuesCategorical({values, scale, parentKey: axisKey, title: 'Axis ' + axisKey})
}

export function isNumberArray(arr: any[]): arr is number[] {
  return arr.length > 0 && typeof arr[0] === 'number'
}

export function isStringArray(arr: any[]): arr is string[] {
  return arr.length > 0 && typeof arr[0] === 'string'
}

export function isDateArray(arr: any[]): arr is Date[] {
  return arr.length > 0 && arr[0] instanceof Date
}

function hasValueOf(arr: any[]): arr is { valueOf: () => number }[] {
  return arr.length > 0 && typeof arr[0].valueOf === "number"
}

export function getFilteredScaledValues(scaledValues: ScaledValuesBase<AxisDomainRV>): ScaledValuesBase<AxisDomainRV> {
  if (scaledValues instanceof ScaledValuesCategorical) {
    const activeDomain = scaledValues.categories.values.reduce((prev, current, i) => {
      const key = `${scaledValues.parentKey}-${scaledValues.categories.keyValues[i]}`
      return scaledValues.keysActive[key] ? [...prev, current] : prev
    }, [])
    const clone = scaledValues.clone()
    clone.scale.domain(activeDomain)
    return clone
  }
  return scaledValues
}
