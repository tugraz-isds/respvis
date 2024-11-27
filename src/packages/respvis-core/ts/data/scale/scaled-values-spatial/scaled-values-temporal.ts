import {ScaledValuesSpatialBase, ScaledValuesSpatialBaseArgs} from "./scaled-values-spatial-base";
import {max, min, scaleTime, ScaleTime, ZoomTransform} from "d3";
import {AxisType} from "../../../constants/types";
import {ErrorMessages} from "../../../constants/error";

export type ScaledValuesTemporalUserArgs = {
  values: Date[],
  scale?: ScaleTime<number, number, never>
}

type ScaledValuesTemporalArgs = ScaledValuesTemporalUserArgs & ScaledValuesSpatialBaseArgs

export class ScaledValuesTemporal extends ScaledValuesSpatialBase<Date> {
  tag = 'date' as const
  values: Date[]
  scale: ScaleTime<number, number, never>
  flippedScale: ScaleTime<number, number, never>
  filteredRanges: [Date, Date][]

  constructor(args: ScaledValuesTemporalArgs | ScaledValuesTemporal) {
    super(args)
    this.values = args.values
    const extentMin = min(this.values)
    const extentMax = max(this.values)
    if (!extentMin || !extentMax) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.scale = args.scale ?? scaleTime([extentMin, extentMax], [0, 600]).nice()
    this.flippedScale = this.scale.copy()
    if ('tag' in args) {
      this.filteredRanges = args.filteredRanges
      this.inverted = args.inverted
    } else {
      this.filteredRanges = [this.scale.domain() as [Date, Date]]
    }
  }

  isValueActive(index: number): boolean {
    for(let i = 0; i < this.filteredRanges.length; i++) {
      const range = this.filteredRanges[i]
      if (this.values[index] >= range[0] && this.values[index] <= range[1]) return true
    }
    return false
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType): ScaledValuesTemporal {
    const scale = axisType === 'x' ? transform.rescaleX(this.scale) : transform.rescaleY(this.scale)
    return new ScaledValuesTemporal({...this, scale})
  }

  cloneFiltered() {
    return this.clone();
  }

  atScreenPosition(value: number) {
    return this.scale.invert(value)
  }

  getNearestValue(estimate: Date): Date {
    let nearest = this.values[0]
    for (let i = 1; i < this.values.length; i++) {
      const current = this.values[i]
      if ( Math.abs(current.valueOf() - estimate.valueOf()) < Math.abs(nearest.valueOf() - estimate.valueOf()) ) nearest = current
    }
    return nearest
  }

  clone(): ScaledValuesTemporal {
    return new ScaledValuesTemporal({...this, scale: this.scale.copy()})
  }
}
