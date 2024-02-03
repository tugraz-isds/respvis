import {ScaledValuesArg, ScaledValuesDateUserArgs, ScaledValuesDateValid} from "./scaled-values";
import {ScaledValuesBase} from "./scaled-values-base";
import {scaleLinear, ScaleLinear, scaleTime, ScaleTime} from "d3";

export class ScaledValuesDate extends ScaledValuesBase<Date> {
  tag = 'date' as const
  values: Date[]
  scale: ScaleTime<number, number, never>

  constructor(arg: ScaledValuesArg<Date>) {
    super()
    this.values = arg.values
    this.scale = arg.scale ?? scaleTime(this.values, [0, 600]).nice()
  }

  clone(): ScaledValuesDate {
    return new ScaledValuesDate({...this, scale: this.scale.copy()})
  }
}
