import {AxisDomain} from 'd3';
import {ErrorMessages} from "../../../constants/error";
import {AxisKey} from "../../../constants/types";
import {ScaledValuesTemporal} from "./scaled-values-temporal";
import {ScaledValuesNumeric} from "./scaled-values-numeric";
import {ScaledValuesCategorical} from "./scaled-values-categorical";
import {RVArray} from "../../../utilities";
import {ScaledValuesSpatial, ScaledValuesSpatialUserArgs} from "./scaled-values-spatial";
import {isScaleCategory, isScaleLinear, isScaleTime} from "../scales";

const {equalizeLengths, hasValueOf, isDateArray, isNumberArray, isStringArray} = RVArray

export type ScaledValuesSpatialDomain = Extract<AxisDomain, number | string | Date>

export function validateScaledValuesSpatial(axisScaleArgs: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>,
                                            axisKey: AxisKey): ScaledValuesSpatial {
  const {values, scale} = axisScaleArgs

  if (values.length <= 0) throw new Error(ErrorMessages.responsiveValueHasNoValues)

  if (isDateArray(values)) {
    if (scale && !isScaleTime(scale)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    return new ScaledValuesTemporal({values, scale, parentKey: axisKey})
  }

  if (isNumberArray(values) || hasValueOf(values)) {
    if (scale && !isScaleLinear(scale)) {
      throw new Error(ErrorMessages.invalidScaledValuesCombination)
    }
    const valuesNum = isNumberArray(values) ?
      values.map(value => Number(value)) :
      values.map(value => parseFloat(value.valueOf()))
    return new ScaledValuesNumeric({values: valuesNum, scale, parentKey: axisKey})
  }

  if (isStringArray(values)) {
    if (scale && !isScaleCategory(scale)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    return new ScaledValuesCategorical({values, scale, parentKey: axisKey, title: 'Axis ' + axisKey})
  }
  throw new Error(ErrorMessages.invalidScaledValuesCombination)
}


type SV = { values: any[], scale?: any }
export function alignScaledValuesLengths<S1 extends SV, S2 extends SV>
(vws1: S1, vws2: S2): [S1, S2] {
  const [vws1Aligned, vws2Aligned] = equalizeLengths(vws1.values, vws2.values)
  const newVws1: S1 = {...vws1, values: vws1Aligned}
  const newVws2: S2 = {...vws2, values: vws2Aligned}
  return [newVws1, newVws2]
}


export type ScaledValuesSpatialOrdered<T> = {
  [K in ScaledValuesSpatial["tag"]]: {
    values: Extract<ScaledValuesSpatial, { tag: K }>,
    wrapper: T
  }[]
}

export function orderScaledValuesSpatial<T>(values: ScaledValuesSpatial[], wrappers: T[]): ScaledValuesSpatialOrdered<T> {
  const valuesOrdered: ScaledValuesSpatialOrdered<T> = {linear: [], categorical: [], date: []}
  values.forEach((val, index) => {
    //@ts-ignore
    valuesOrdered[val.tag].push({values: val, wrapper: wrappers[index]})
  })
  return valuesOrdered
}
