import {ErrorMessages} from "../../constants";
import {ScaledValuesNumeric, ScaledValuesNumericUserArgs, validateScaledValuesSpatial} from "../scale";
import {BaseAxis, BaseAxisUserArgs, validateBaseAxis} from "../../render/axis";
import {Renderer} from "../../render/chart";
import {Series} from "../../render/series";
import {
  BreakpointProperty,
  BreakpointPropertyOptional,
  BreakpointPropertyUserArgs,
  validateBreakpointProperty
} from "../responsive-property";
import {Extrema, isExtrema} from "./extrema";
import {scaleLinear, ScaleLinear} from "d3";

export type BubbleRadiusUserArgs = ScaledValuesNumericUserArgs & {
  extrema: BreakpointPropertyUserArgs<Extrema>
  axis: BaseAxisUserArgs
}

export type BubbleRadiusArgs = BubbleRadiusUserArgs & {
  renderer: Renderer
  series: Series
}

type LinearRangeAxis = Omit<BaseAxis, 'scaledValues'> & {
  scaledValues: ScaledValuesNumeric
}

export type BubbleRadius = Omit<BubbleRadiusArgs, 'series' | 'renderer' | 'axis' | 'extrema'> & {
  tag: 'bubble'
  axis: LinearRangeAxis,
  scale: ScaleLinear<number, number, never>
  extrema: BreakpointPropertyOptional<Extrema>
}

export function isBubbleRadiusUserArgs(args: any): args is BubbleRadiusUserArgs {
  return 'extrema' in args && 'axis' in args
}

export function validateBubbleRadius(args: BubbleRadiusArgs): BubbleRadius {
  const {series, renderer, values} = args
  const extrema = validateBubbleRadiusExtrema(args.extrema)

  const scale = args.scale ??
    scaleLinear().domain([Math.min(...values), Math.max(...values)]).nice()

  const axis = validateBaseAxis({...args.axis, renderer, series,
    scaledValues: validateScaledValuesSpatial({values},'ar-0'),
  }) as LinearRangeAxis

  return {extrema, values, scale, axis, tag: 'bubble'}
}

function validateBubbleRadiusExtrema(extremaArgs: BreakpointPropertyUserArgs<Extrema>) {
  const extrema = validateBreakpointProperty(extremaArgs)
  if (extrema instanceof BreakpointProperty) {
    const mapping = extrema.mapping
    Object.values(mapping).forEach((values) => {
      if (values.minimum > values.maximum) throw new Error(ErrorMessages.invalidExtremaCombination)
    })
    return extrema
  }
  if (!isExtrema(extrema)) throw new Error(ErrorMessages.invalidResponsiveValue)
  return extrema
}
