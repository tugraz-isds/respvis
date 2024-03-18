import {AxisType, ScaledValueTag, ToArray} from "../../constants/types";
import {AxisDomainRV} from "./axis-scaled-values-validation";
import {ScaleBase} from "./scales";
import {ZoomTransform} from "d3";

export type ScaledValuesBaseArgs = { parentKey: string }

export abstract class ScaledValuesBase<T extends AxisDomainRV> {
  abstract readonly tag: ScaledValueTag
  abstract readonly values: ToArray<T>
  abstract readonly scale: ScaleBase<T>
  readonly parentKey: string
  protected constructor(args: ScaledValuesBaseArgs) {
    this.parentKey = args.parentKey
  }
  getScaleInverseRanged() {
    const originalRange = this.scale.range()
    return this.scale.copy().range([originalRange[1], originalRange[0]])
  }

  getScaledValue(i: number) {
    return this.scale(this.values[i] as any)!
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

  abstract clone(): ScaledValuesBase<T>
}
