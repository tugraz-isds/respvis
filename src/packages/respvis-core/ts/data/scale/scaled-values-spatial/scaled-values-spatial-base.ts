import {AxisType, KeyPrefix, Orientation, ScaledValueTag, ToArray} from "../../../constants/types";
import {ScaledValuesSpatialDomain} from "./validate-scaled-values-spatial";
import {ScaleBase} from "../scales";
import {ZoomTransform} from "d3";

import {ScaledValuesSpatial} from "./scaled-values-spatial";
import {Key} from "../../../utilities";

export type ScaledValuesSpatialBaseArgs = { }

export abstract class ScaledValuesSpatialBase<T extends ScaledValuesSpatialDomain> {
  abstract readonly tag: ScaledValueTag
  abstract readonly values: ToArray<T>
  abstract readonly scale: ScaleBase<T>
  abstract readonly flippedScale: ScaleBase<T>
  inverted: boolean
  orientation: Orientation = "horizontal"
  horizontalRange: number[] = [0, 1]
  verticalRange: number[] = [1, 0]
  protected constructor(args: ScaledValuesSpatialBaseArgs) {
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

  getKeys(i: number): Key<KeyPrefix>[] {
    return []
  }

  abstract atScreenPosition(value: number): T

  isKeyActiveByKey(key: string) {
    return true
  }

  abstract isValueActive(index: number): boolean

  setKeyActiveIfDefined(key: string, value: boolean) {
  }

  cloneFiltered(): ScaledValuesSpatial {
    return this.clone()
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValuesSpatial {
    return this.clone()
  }

  cloneRangeInversed() {
    const clone = this.clone()
    clone.scale.range(this.getCurrentRangeInversed())
    clone.inverted = !this.inverted
    return clone
  }

  abstract clone(): ScaledValuesSpatial
}

const percentRangeFormulaWithInverse = {
  horizontal: <T extends ScaledValuesSpatialDomain>(percent: number, scaledValues: ScaledValuesSpatialBase<T>) => {
    return scaledValues.scale.range()[1] * percent
  },
  vertical: <T extends ScaledValuesSpatialDomain>(percent: number, scaledValues: ScaledValuesSpatialBase<T>) => {
    return scaledValues.scale.range()[0] - scaledValues.scale.range()[0] * percent
  }
}

const percentRangeFormulaWithoutInverse = {
  horizontal: <T extends ScaledValuesSpatialDomain>(percent: number, scaledValues: ScaledValuesSpatialBase<T>) => {
    return scaledValues.getRangeInverseUndone()[1] * percent
  },
  vertical: <T extends ScaledValuesSpatialDomain>(percent: number, scaledValues: ScaledValuesSpatialBase<T>) => {
    return scaledValues.getRangeInverseUndone()[0] - scaledValues.getRangeInverseUndone()[0] * percent
  }
}
