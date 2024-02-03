import {ScaledValuesArg} from "./scaled-values";
import {ScaledValuesBase} from "./scaled-values-base";
import {scaleTime, ScaleTime, ZoomTransform} from "d3";
import {AxisType} from "../../constants/types";

export class ScaledValuesDate extends ScaledValuesBase<Date> {
  tag = 'date' as const
  values: Date[]
  scale: ScaleTime<number, number, never>

  constructor(arg: ScaledValuesArg<Date>) {
    super()
    this.values = arg.values
    this.scale = arg.scale ?? scaleTime(this.values, [0, 600]).nice()
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValuesDate {
    const scale = axisType === 'x' ? transform.rescaleX(this.scale) : transform.rescaleY(this.scale)
    return new ScaledValuesDate({...this, scale})
  }

  clone(): ScaledValuesDate {
    return new ScaledValuesDate({...this, scale: this.scale.copy()})
  }
}
