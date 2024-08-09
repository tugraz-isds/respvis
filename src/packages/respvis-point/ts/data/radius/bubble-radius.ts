import {
  BaseAxis,
  BaseAxisUserArgs,
  DataSeries,
  ErrorMessages,
  Renderer,
  ScaledValuesNumeric,
  ScaledValuesNumericUserArgs,
  ScaleNumeric,
  validateBaseAxis,
  validateScaledValuesSpatial
} from "respvis-core";
import {
  BreakpointProperty,
  BreakpointPropertyOptional,
  BreakpointPropertyUserArgs,
  validateBreakpointProperty
} from "respvis-core/data/responsive-property";
import {Extrema, isExtrema} from "./extrema";
import {scaleLinear} from "d3";

export type BubbleRadiusUserArgs = ScaledValuesNumericUserArgs & {
  extrema: BreakpointPropertyUserArgs<Extrema>
  axis: BaseAxisUserArgs
}

export type BubbleRadiusArgs = BubbleRadiusUserArgs & {
  renderer: Renderer
  series: DataSeries
}

type LinearRangeAxis = Omit<BaseAxis, 'scaledValues'> & {
  scaledValues: ScaledValuesNumeric
}

export type BubbleRadius = Omit<BubbleRadiusArgs, 'series' | 'renderer' | 'axis' | 'extrema'> & {
  tag: 'bubble'
  axis: LinearRangeAxis,
  scale: ScaleNumeric
  extrema: BreakpointPropertyOptional<Extrema>
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
