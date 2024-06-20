import {ScaleSequential} from "d3";
import {BaseAxis, Renderer, Series, validateBaseAxis} from "../../render";
import {LightWeightAxisUserArgs} from "../../render/axis/validate-lightweight-axis";
import {validateScaledValuesAxis} from "../scale";

export type ScaledValuesSequentialColorUserArgs = {
  values: number[]
  scale: ScaleSequential<number, number>
  axis: LightWeightAxisUserArgs
}

export type ScaledValuesSequentialColorArgs = ScaledValuesSequentialColorUserArgs & {
  renderer: Renderer
  series: Series
}

export type ScaledValuesSequentialColor = Pick<ScaledValuesSequentialColorArgs, 'scale' | 'values'> & {
  axis: BaseAxis
};

export function validateScaledValuesSequentialColor(arg: ScaledValuesSequentialColorArgs): ScaledValuesSequentialColor {
  const {axis, renderer, values, scale, series} = arg
  const scaledValues = validateScaledValuesAxis({values}, 'ac-0')
  return { values, scale,
    axis: validateBaseAxis({...axis, scaledValues, renderer, series})
  }
}
