import {ErrorMessages, RadiiAxisPrefix} from "respvis-core/constants";
import {ScaledValuesNumeric, ScaledValuesNumericUserArgs, validateScaledValuesSpatial} from "respvis-core/data/scale";
import {BaseAxis, BaseAxisUserArgs, validateBaseAxis} from "respvis-core/render/axis";
import {Renderer} from "respvis-core/render/chart";
import {Series} from "respvis-core/render/series";
import {
  BreakpointProperty,
  BreakpointPropertyOptional,
  BreakpointPropertyUserArgs,
  validateBreakpointProperty
} from "respvis-core/data/responsive-property";
import {Extrema, isExtrema} from "./extrema";
import {scaleLinear, ScaleLinear} from "d3";
import {Key} from "respvis-core";

export type BubbleRadiusUserArgs = ScaledValuesNumericUserArgs & {
  extrema: BreakpointPropertyUserArgs<Extrema>
  axis: BaseAxisUserArgs
}

export type BubbleRadiusArgs = BubbleRadiusUserArgs & {
  renderer: Renderer
  series: Series
}

type RadiusAxis = Omit<BaseAxis, 'scaledValues'> & {
  scaledValues: ScaledValuesNumeric,
  key: Key<RadiiAxisPrefix>
}

export type BubbleRadius = Omit<BubbleRadiusArgs, 'series' | 'renderer' | 'axis' | 'extrema'> & {
  tag: 'bubble'
  axis: RadiusAxis,
  scale: ScaleLinear<number, number, never>
  extrema: BreakpointPropertyOptional<Extrema>
}

export function validateBubbleRadius(args: BubbleRadiusArgs): BubbleRadius {
  const {series, renderer, values} = args
  const extrema = validateBubbleRadiusExtrema(args.extrema)

  const scale = args.scale ??
    scaleLinear().domain([Math.min(...values), Math.max(...values)]).nice()

  const axis = {
    ...validateBaseAxis({...args.axis, renderer, series,
      scaledValues: validateScaledValuesSpatial({values}), key: 0
    }),
    key: new Key('ar', [0])
  } as RadiusAxis

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
