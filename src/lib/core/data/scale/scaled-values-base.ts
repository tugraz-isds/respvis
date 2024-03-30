import {AxisType, ScaledValueTag, ToArray} from "../../constants/types";
import {AxisDomainRV} from "./axis-scaled-values-validation";
import {ScaleBase} from "./scales";
import {ZoomTransform} from "d3";
import {ScaledValuesLinear} from "./scaled-values-linear";
import {ScaledValuesDate} from "./scaled-values-date";
import {ScaledValuesCategorical} from "./scaled-values-categorical";

export type ScaledValuesBaseArgs = { parentKey: string }

export type ScaledValues = ScaledValuesLinear | ScaledValuesDate | ScaledValuesCategorical

export abstract class ScaledValuesBase<T extends AxisDomainRV> {
  abstract readonly tag: ScaledValueTag
  abstract readonly values: ToArray<T>
  abstract readonly scale: ScaleBase<T>
  readonly parentKey: string
  inverted: boolean
  protected constructor(args: ScaledValuesBaseArgs) {
    this.parentKey = args.parentKey
    this.inverted = false
  }

  getScaledValue(i: number) {
    return this.scale(this.values[i] as any)!
  }

  getOriginalRange() {
    return this.inverted ? this.getCurrentRangeInversed() : this.scale.range()
  }

  getCurrentRangeInversed() {
    const originalRange = this.scale.range()
    return [originalRange[1], originalRange[0]]
  }

  abstract scaledValueAtScreenPosition(value: number): string

  isKeyActiveByKey(key: string) { return true }

  isKeyActiveByIndex(i: number) { return true }

  setKeyActiveIfDefined(key: string, value: boolean) {}

  cloneFiltered(): ScaledValuesBase<T> {
    return this.clone()
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValuesBase<T> {
    return this.clone()
  }

  cloneRangeInversed() {
    const clone = this.clone()
    clone.scale.range(this.getCurrentRangeInversed())
    clone.inverted = !this.inverted
    return clone
  }

  abstract clone(): ScaledValuesBase<T>
}
