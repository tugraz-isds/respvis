import {ScaledValuesArg} from "./scaled-values";
import {ScaledValuesBase} from "./scaled-values-base";
import {scaleLinear, ScaleLinear} from "d3";

export class ScaledValuesLinear extends ScaledValuesBase<number> {
  tag = 'linear' as const
  values: number[]
  scale: ScaleLinear<number, number, never>

  constructor(args: ScaledValuesArg<number>) {
    super()
    this.values = args.values
    const extent = [Math.min(...this.values), Math.max(...this.values)]
    this.scale = args.scale ?? scaleLinear().domain(extent).nice()
  }

  clone(): ScaledValuesLinear {
    return new ScaledValuesLinear({...this, scale: this.scale.copy()})
  }
}
