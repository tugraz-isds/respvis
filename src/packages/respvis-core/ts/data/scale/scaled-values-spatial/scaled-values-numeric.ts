import {ScaledValuesSpatialBase, ScaledValuesSpatialBaseArgs} from "./scaled-values-spatial-base";
import {scaleLinear, ScaleLinear, ScaleLogarithmic, ScalePower, ZoomTransform} from "d3";
import {AxisType} from "../../../constants/types";

export type ScaledValuesNumericUserArgs = {
  values: number[],
  scale?: ScaleLinear<number, number, never> | ScaleLogarithmic<number, number> |
    ScalePower<number, number>
}

type ScaledValuesNumericArgs = ScaledValuesNumericUserArgs & ScaledValuesSpatialBaseArgs

export class ScaledValuesNumeric extends ScaledValuesSpatialBase<number> {
  tag = 'linear' as const
  values: number[]
  scale: ScaleLinear<number, number, never> | ScaleLogarithmic<number, number> |
    ScalePower<number, number>
  flippedScale: ScaleLinear<number, number, never> | ScaleLogarithmic<number, number> |
    ScalePower<number, number>
  filteredRanges: [number, number][]

  constructor(args: ScaledValuesNumericArgs | ScaledValuesNumeric) {
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

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValuesNumeric {
    const scale = axisType === 'x' ? transform.rescaleX(this.scale) : transform.rescaleY(this.scale)
    return new ScaledValuesNumeric({...this, scale})
  }

  cloneFiltered() {
    return this.clone();
  }

  atScreenPosition(value: number) {
    return this.scale.invert(value)
  }

  clone(): ScaledValuesNumeric {
    return new ScaledValuesNumeric({...this, scale: this.scale.copy()})
  }
}
