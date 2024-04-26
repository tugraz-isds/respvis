import {ScaledValuesDateUserArgs} from "./scaled-values";
import {ScaledValuesBase, ScaledValuesBaseArgs} from "./scaled-values-base";
import {max, min, scaleTime, ScaleTime, ZoomTransform} from "d3";
import {AxisType} from "../../constants/types";
import {ErrorMessages} from "../../utilities/error";

type ScaledValuesDateArgs = ScaledValuesDateUserArgs & ScaledValuesBaseArgs

export class ScaledValuesDate extends ScaledValuesBase<Date> {
  tag = 'date' as const
  values: Date[]
  scale: ScaleTime<number, number, never>
  flippedScale: ScaleTime<number, number, never>

  constructor(args: ScaledValuesDateArgs) {
    super(args)
    this.values = args.values
    const extentMin = min(this.values)
    const extentMax = max(this.values)
    if (!extentMin || !extentMax) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.scale = args.scale ?? scaleTime([extentMin, extentMax], [0, 600]).nice()
    this.flippedScale = this.scale.copy()
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValuesDate {
    const scale = axisType === 'x' ? transform.rescaleX(this.scale) : transform.rescaleY(this.scale)
    return new ScaledValuesDate({...this, scale})
  }

  cloneFiltered() {
    return this.clone();
  }

  scaledValueAtScreenPosition(value: number): string {
    return this.scale(value).toString()
  }

  clone(): ScaledValuesDate {
    return new ScaledValuesDate({...this, scale: this.scale.copy()})
  }
}
