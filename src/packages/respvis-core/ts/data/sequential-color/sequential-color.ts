import {BaseAxis, BaseAxisUserArgs, validateBaseAxis} from "../../render/axis";
import {Series} from "../../render/series";
import {Renderer} from "../../render/chart";
import {validateScaledValuesSpatial} from "../scale";
import {ScaledValuesSequential} from "../scale/scaled-values-sequential";
import {Key} from "../../utilities";

export type SequentialColorUserArgs = ScaledValuesSequential & {
  axis: BaseAxisUserArgs
}

export type SequentialColorArgs = SequentialColorUserArgs & {
  renderer: Renderer
  series: Series
}

export type SequentialColor = Pick<SequentialColorArgs, 'scale' | 'values'> & {
  axis: BaseAxis
};

export function validateSequentialColor(arg: SequentialColorArgs): SequentialColor {
  const {axis, renderer, values, scale, series} = arg
  const scaledValues = validateScaledValuesSpatial({values})
  return {
    values, scale,
    axis: {
      ...validateBaseAxis({...axis, scaledValues, renderer, series, key: 0}),
      key: new Key('ac', [0])
    }
  }
}
