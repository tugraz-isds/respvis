import {ScaledValuesLinearUserArgs} from "./scaled-values";
import {ScaledValuesBase, ScaledValuesBaseArgs} from "./scaled-values-base";
import {scaleLinear, ScaleLinear, ZoomTransform} from "d3";
import {AxisType} from "../../constants/types";

type ScaledValuesLinearArgs = ScaledValuesLinearUserArgs & ScaledValuesBaseArgs

export class ScaledValuesLinear extends ScaledValuesBase<number> {
  tag = 'linear' as const
  values: number[]
  scale: ScaleLinear<number, number, never>
  flippedScale: ScaleLinear<number, number, never>
  filteredRanges: [number, number][]

  constructor(args: ScaledValuesLinearArgs | ScaledValuesLinear) {
    super(args)
    this.values = args.values
    const extent = [Math.min(...this.values), Math.max(...this.values)]
    this.scale = args.scale ?? scaleLinear().domain(extent).nice()
    this.flippedScale = this.scale.copy()
    if ('tag' in args) {
      this.filteredRanges = args.filteredRanges
    } else {
      this.filteredRanges = [this.scale.domain() as [number, number]]
    }
  }

  isValueActive(index: number): boolean {
    for(let i = 0; i < this.filteredRanges.length; i++) {
      const range = this.filteredRanges[i]
      if (this.values[index] >= range[0] && this.values[index] <= range[1]) return true
    }
    return false
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValuesLinear {
    const scale = axisType === 'x' ? transform.rescaleX(this.scale) : transform.rescaleY(this.scale)
    return new ScaledValuesLinear({...this, scale})
  }

  cloneFiltered() {
    return this.clone();
  }

  atScreenPosition(value: number) {
    return this.scale.invert(value)
  }

  clone(): ScaledValuesLinear {
    return new ScaledValuesLinear({...this, scale: this.scale.copy()})
  }
}
