import {ToArray} from "../../constants/types";
import {arrayAlignLengths} from "../../utilities/array";
import {ScaleBand, ScaleLinear, ScaleTime} from "d3";

//TODO: add all additional scales offered by d3
export type ScaledValuesArg<Domain> =
  Domain extends Date ? { values: ToArray<Date>, scale?: ScaleTime<number, number, never> } :
  Domain extends number ? { values: ToArray<number>, scale?: ScaleLinear<number, number, never> } :
  Domain extends string ? { values: ToArray<string>, scale?: ScaleBand<string> } : never

export type ScaledValuesValid<Domain> = Required<ScaledValuesArg<Domain>>

type SV = {values: any[], scale?: any}
export function alignScaledValuesLengths<S1 extends SV, S2 extends SV>
(vws1: S1, vws2: S2): [S1, S2] {
  const [vws1Aligned, vws2Aligned] = arrayAlignLengths(vws1.values, vws2.values)
  const newVws1: S1 = {...vws1, values: vws1Aligned}
  const newVws2: S2 = {...vws2, values: vws2Aligned}
  return [newVws1, newVws2]
}
