import {ScaledValuesSpatialBase, ScaledValuesSpatialBaseArgs} from "./scaled-values-spatial-base";
import {scaleLinear, ZoomTransform} from "d3";
import {AxisType} from "../../../constants/types";
import {ScaleNumeric} from "../scales";

export type ScaledValuesNumericUserArgs = {
  values: number[],
  scale?: ScaleNumeric
}

type ScaledValuesNumericArgs = ScaledValuesNumericUserArgs & ScaledValuesSpatialBaseArgs

export class ScaledValuesNumeric extends ScaledValuesSpatialBase<number> {
  tag = 'linear' as const
  values: number[]
  scale: ScaleNumeric
  flippedScale: ScaleNumeric
  filteredRanges: [number, number][]

  constructor(args: ScaledValuesNumericArgs | ScaledValuesNumeric) {
    super(args)
    this.values = args.values
    const extent = [Math.min(...this.values), Math.max(...this.values)]
    this.scale = args.scale ?? scaleLinear().domain(extent).nice()
    this.flippedScale = this.scale.copy()
    if ('tag' in args) {
      this.filteredRanges = args.filteredRanges
      this.inverted = args.inverted
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
