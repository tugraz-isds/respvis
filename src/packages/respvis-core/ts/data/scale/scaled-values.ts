import {ToArray} from "../../constants/types";
import {arrayAlignLengths} from "../../utilities/array";
import {ScaleBand, ScaleLinear, ScaleTime} from "d3";

//TODO: add all additional scales offered by d3

export type ScaledValuesDateUserArgs = { values: ToArray<Date>, scale?: ScaleTime<number, number, never> }
export type ScaledValuesLinearUserArgs = { values: ToArray<number>, scale?: ScaleLinear<number, number, never> }
export type ScaledValuesCategoricalUserArgs = { values: ToArray<string>, scale?: ScaleBand<string> }

export type ScaledValuesUserArgs<Domain> =
  Domain extends Date ? ScaledValuesDateUserArgs :
  Domain extends number ? ScaledValuesLinearUserArgs :
  Domain extends string ? ScaledValuesCategoricalUserArgs : never


type SV = {values: any[], scale?: any}
export function alignScaledValuesLengths<S1 extends SV, S2 extends SV>
(vws1: S1, vws2: S2): [S1, S2] {
  const [vws1Aligned, vws2Aligned] = arrayAlignLengths(vws1.values, vws2.values)
  const newVws1: S1 = {...vws1, values: vws1Aligned}
  const newVws2: S2 = {...vws2, values: vws2Aligned}
  return [newVws1, newVws2]
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




