import {ScaledValuesLinear, ScaledValuesLinearUserArgs, validateScaledValuesAxis} from "../scale";
import {BaseAxis, BaseAxisUserArgs, Renderer, Series, validateBaseAxis} from "../../render";
import {ErrorMessages} from "../../constants";
import {scaleLinear, ScaleLinear} from "d3";
import {
  RespValInterpolated,
  RespValInterpolatedOptional,
  RespValInterpolatedUserArgs,
  validateRespValInterpolated
} from "../responsive-value/responsive-value-interpolated";
import {Extrema, isExtrema} from "./extrema";

export type BubbleRadiusUserArgs = ScaledValuesLinearUserArgs & {
  extrema: RespValInterpolatedUserArgs<Extrema>
  axis: BaseAxisUserArgs
}

export type BubbleRadiusArgs = BubbleRadiusUserArgs & {
  renderer: Renderer
  series: Series
}

type LinearRangeAxis = Omit<BaseAxis, 'scaledValues'> & {
  scaledValues: ScaledValuesLinear
}

export type BubbleRadius = Omit<BubbleRadiusArgs, 'series' | 'renderer' | 'axis' | 'extrema'> & {
  tag: 'bubble'
  axis: LinearRangeAxis,
  scale: ScaleLinear<number, number, never>
  extrema: RespValInterpolatedOptional<Extrema>
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
    scaledValues: validateScaledValuesAxis({values},'ar-0'),
  }) as LinearRangeAxis

  return {extrema, values, scale, axis, tag: 'bubble'}
}

function validateBubbleRadiusExtrema(extremaArgs: RespValInterpolatedUserArgs<Extrema>) {
  const extrema = validateRespValInterpolated(extremaArgs)
  if (extrema instanceof RespValInterpolated) {
    const mapping = extrema.mapping
    Object.values(mapping).forEach((values) => {
      if (values.minimum > values.maximum) throw new Error(ErrorMessages.invalidExtremaCombination)
    })
    return extrema
  }
  if (!isExtrema(extrema)) throw new Error(ErrorMessages.invalidResponsiveValue)
  return extrema
}
