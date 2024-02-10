import {ScaledValuesLinearUserArgs} from "./scaled-values";
import {ScaledValuesBase, ScaledValuesBaseArgs} from "./scaled-values-base";
import {scaleLinear, ScaleLinear, ZoomTransform} from "d3";
import {AxisType} from "../../constants/types";

type ScaledValuesLinearArgs = ScaledValuesLinearUserArgs & ScaledValuesBaseArgs

export class ScaledValuesLinear extends ScaledValuesBase<number> {
  tag = 'linear' as const
  values: number[]
  scale: ScaleLinear<number, number, never>

  constructor(args: ScaledValuesLinearArgs) {
    super(args)
    this.values = args.values
    const extent = [Math.min(...this.values), Math.max(...this.values)]
    this.scale = args.scale ?? scaleLinear().domain(extent).nice()
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValuesLinear {
    const scale = axisType === 'x' ? transform.rescaleX(this.scale) : transform.rescaleY(this.scale)
    return new ScaledValuesLinear({...this, scale})
  }

  clone(): ScaledValuesLinear {
    return new ScaledValuesLinear({...this, scale: this.scale.copy()})
  }
}
