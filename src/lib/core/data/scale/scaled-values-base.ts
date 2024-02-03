import {AxisType, ScaledValueTag, ToArray} from "../../constants/types";
import {AxisDomainRV} from "./axis-scaled-values-validation";
import {ScaleBase} from "./scales";
import {ZoomTransform} from "d3";

export abstract class ScaledValuesBase<T extends AxisDomainRV> {
  abstract readonly tag: ScaledValueTag
  abstract readonly values: ToArray<T>
  abstract readonly scale: ScaleBase<T>
  protected constructor() {}
  getScaleInverseRanged() {
    const originalRange = this.scale.range()
    return this.scale.copy().range([originalRange[1], originalRange[0]])
  }

  getScaledValue(i: number) {
    return this.scale(this.values[i] as any)!
  }

  isKeyActive(keyActive: string) { return true }

  cloneFiltered(): ScaledValuesBase<T> {
    return this.clone()
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValuesBase<T> {
    return this.clone()
  }

  abstract clone(): ScaledValuesBase<T>
}
