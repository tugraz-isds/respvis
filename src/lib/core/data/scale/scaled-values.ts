import {ToArray} from "../../constants/types";
import {arrayAlignLengths} from "../../utilities/array";
import {ScaleBand, ScaleLinear, ScaleTime} from "d3";
import {isDateArray, isNumberArray, isStringArray} from "./axis-scaled-values-validation";

//TODO: add all additional scales offered by d3

export type ScaledValuesDateUserArgs = { values: ToArray<Date>, scale?: ScaleTime<number, number, never> }
export type ScaledValuesDateValid = Required<ScaledValuesDateUserArgs>

export type ScaledValuesLinearUserArgs = { values: ToArray<number>, scale?: ScaleLinear<number, number, never> }
export type ScaledValuesLinearValid = Required<ScaledValuesLinearUserArgs>

export type ScaledValuesCategoricalUserArgs = { values: ToArray<string>, scale?: ScaleBand<string> }
export type ScaledValuesCategoricalValid = Required<ScaledValuesCategoricalUserArgs> & {}

export type ScaledValuesArg<Domain> =
  Domain extends Date ? ScaledValuesDateUserArgs :
  Domain extends number ? ScaledValuesLinearUserArgs :
  Domain extends string ? ScaledValuesCategoricalUserArgs : never

export type ScaledValuesValid<Domain> =
  Domain extends Date ? ScaledValuesDateValid :
    Domain extends number ? ScaledValuesLinearValid :
      Domain extends string ? ScaledValuesCategoricalValid: never

type SV = {values: any[], scale?: any}
export function alignScaledValuesLengths<S1 extends SV, S2 extends SV>
(vws1: S1, vws2: S2): [S1, S2] {
  const [vws1Aligned, vws2Aligned] = arrayAlignLengths(vws1.values, vws2.values)
  const newVws1: S1 = {...vws1, values: vws1Aligned}
  const newVws2: S2 = {...vws2, values: vws2Aligned}
  return [newVws1, newVws2]
}

export function isScaledValuesLinear(arg: ScaledValuesValid<any>) : arg is Required<ScaledValuesLinearUserArgs> {
  return isNumberArray(arg.values)
}

export function isScaledValuesCategorical(arg: ScaledValuesValid<any>) : arg is Required<ScaledValuesCategoricalValid> {
  return isStringArray(arg.values)
}

export function isScaledValuesDate(arg: ScaledValuesValid<any>) : arg is Required<ScaledValuesDateUserArgs> {
  return isDateArray(arg.values)
}

export function isScaleTime(arg: any): arg is ScaleTime<number, number, never> {
  const isScale = 'domain' in arg && 'range' in arg
  return isScale && arg.domain()[0] instanceof Date
}

export function isScaleLinear(arg: any): arg is ScaleLinear<number, number, never> {
  const isScale = 'domain' in arg && 'range' in arg
  return isScale && typeof arg.domain()[0] === 'number'
}

export function isScaleCategory(arg: any): arg is ScaleBand<string> {
  const isScale = 'domain' in arg && 'range' in arg
  return isScale && typeof arg.domain()[0] === 'string'
}




