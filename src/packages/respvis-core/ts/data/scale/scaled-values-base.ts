import {AxisType, Orientation, ScaledValueTag, ToArray} from "../../constants/types";
import {AxisDomainRV} from "./validate-scaled-values-axis";
import {ScaleBase} from "./scales";
import {ZoomTransform} from "d3";
import {ScaledValuesLinear} from "./scaled-values-linear";
import {ScaledValuesDate} from "./scaled-values-date";
import {ScaledValuesCategorical} from "./scaled-values-categorical";

export type ScaledValuesBaseArgs = { parentKey: string }

export type ScaledValuesLinearScale = ScaledValuesLinear | ScaledValuesDate
export type ScaledValues = ScaledValuesLinearScale | ScaledValuesCategorical

export type ScaledValuesOrdered<T> = {
  [K in ScaledValues["tag"]]: {
    values: Extract<ScaledValues, { tag: K }>,
    wrapper: T
  }[]
}

export function orderScaledValues<T>(values: ScaledValues[], wrappers: T[]): ScaledValuesOrdered<T> {
  const valuesOrdered: ScaledValuesOrdered<T> = { linear: [], categorical: [], date: [] }
  values.forEach((val, index) => {
    //@ts-ignore
    valuesOrdered[val.tag].push({values: val, wrapper: wrappers[index]})
  })
  return valuesOrdered
}

export abstract class ScaledValuesBase<T extends AxisDomainRV> {
  abstract readonly tag: ScaledValueTag
  abstract readonly values: ToArray<T>
  abstract readonly scale: ScaleBase<T>
  abstract readonly flippedScale: ScaleBase<T>
  readonly parentKey: string
  inverted: boolean
  orientation: Orientation = "horizontal"
  horizontalRange: number[] = [0, 1]
  verticalRange: number[] = [1, 0]
  protected constructor(args: ScaledValuesBaseArgs) {
    this.parentKey = args.parentKey
    this.inverted = false
  }

  updateRange(horizontalRange: number[], verticalRange: number[], orientation: Orientation) {
    this.verticalRange = verticalRange
    this.horizontalRange = horizontalRange
    this.orientation = orientation
    this.scale.range(this.orientation === 'horizontal' ? horizontalRange : verticalRange)
  }

  getScaledValue(i: number) {
    return this.scale(this.values[i] as any)!
  }

  getScaledValueStart(i: number) {
    return this.scale(this.values[i] as any)!
  }

  getScaledValueEnd(i: number) {
    return this.scale(this.values[i] as any)!
  }

  getRangeByPercent(percent: number, considerInverse = true, orientationArg?: Orientation) {
    const orientation = orientationArg ?? this.orientation
    return considerInverse ? percentRangeFormulaWithInverse[orientation](percent, this) :
      percentRangeFormulaWithoutInverse[orientation](percent, this)
  }

  getRangeInverseUndone() {
    return this.inverted ? this.getCurrentRangeInversed() : this.scale.range()
  }

  getCurrentRangeMax() {
    const range = this.getRangeInverseUndone()
    return this.orientation === 'horizontal' ? range[1] : range[0]
  }

  getCurrentRangeInversed() {
    const originalRange = this.scale.range()
    return [originalRange[1], originalRange[0]]
  }

  abstract atScreenPosition(value: number): T

  isKeyActiveByKey(key: string) {
    return true
  }

  abstract isValueActive(index: number): boolean

  setKeyActiveIfDefined(key: string, value: boolean) {
  }

  cloneFiltered(): ScaledValues {
    return this.clone()
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValues {
    return this.clone()
  }

  cloneRangeInversed() {
    const clone = this.clone()
    clone.scale.range(this.getCurrentRangeInversed())
    clone.inverted = !this.inverted
    return clone
  }

  abstract clone(): ScaledValues
}

const percentRangeFormulaWithInverse = {
  horizontal: <T extends AxisDomainRV>(percent: number, scaledValues: ScaledValuesBase<T>) => {
    return scaledValues.scale.range()[1] * percent
  },
  vertical: <T extends AxisDomainRV>(percent: number, scaledValues: ScaledValuesBase<T>) => {
    return scaledValues.scale.range()[0] - scaledValues.scale.range()[0] * percent
  }
}

const percentRangeFormulaWithoutInverse = {
  horizontal: <T extends AxisDomainRV>(percent: number, scaledValues: ScaledValuesBase<T>) => {
    return scaledValues.getRangeInverseUndone()[1] * percent
  },
  vertical: <T extends AxisDomainRV>(percent: number, scaledValues: ScaledValuesBase<T>) => {
    return scaledValues.getRangeInverseUndone()[0] - scaledValues.getRangeInverseUndone()[0] * percent
  }
}
