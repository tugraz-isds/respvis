import {ToArray} from "../../constants/types";
import {arrayAlignLengths} from "../../utilities/array";
import {ScaleBand, ScaleLinear, ScaleTime} from "d3";
import {isDateArray, isNumberArray, isStringArray} from "./axis-scaled-values-validation";
import {CategoryValid} from "../category";

//TODO: add all additional scales offered by d3
type ScaledValuesDate = { values: ToArray<Date>, scale?: ScaleTime<number, number, never> }
type ScaledValuesLinear = { values: ToArray<number>, scale?: ScaleLinear<number, number, never> }
type ScaledValuesCategoricalArg = { values: ToArray<string>, scale?: ScaleBand<string>,
  parentKey: string
}
type ScaledValuesCategoricalValid = Required<ScaledValuesCategoricalArg> & {
  categories: CategoryValid
}

export type ScaledValuesArg<Domain> =
  Domain extends Date ? ScaledValuesDate :
  Domain extends number ? ScaledValuesLinear :
  Domain extends string ? ScaledValuesCategoricalArg : never

export type ScaledValuesValid<Domain> =
  Domain extends Date ? Required<ScaledValuesDate> :
    Domain extends number ? Required<ScaledValuesLinear> :
      Domain extends string ? ScaledValuesCategoricalValid: never

type SV = {values: any[], scale?: any}
export function alignScaledValuesLengths<S1 extends SV, S2 extends SV>
(vws1: S1, vws2: S2): [S1, S2] {
  const [vws1Aligned, vws2Aligned] = arrayAlignLengths(vws1.values, vws2.values)
  const newVws1: S1 = {...vws1, values: vws1Aligned}
  const newVws2: S2 = {...vws2, values: vws2Aligned}
  return [newVws1, newVws2]
}

export function isScaledValuesLinear(arg: ScaledValuesValid<any>) : arg is Required<ScaledValuesLinear> {
  return isNumberArray(arg.values)
}

export function isScaledValuesCategorical(arg: ScaledValuesValid<any>) : arg is Required<ScaledValuesCategoricalArg> {
  return isStringArray(arg.values)
}

export function isScaledValuesDate(arg: ScaledValuesValid<any>) : arg is Required<ScaledValuesDate> {
  return isDateArray(arg.values)
}
