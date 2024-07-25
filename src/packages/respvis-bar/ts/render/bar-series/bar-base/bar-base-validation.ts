import {
  CartesianSeriesArgs,
  CartesianSeriesData,
  CartesianSeriesUserArgs,
  validateCartesianSeriesArgs
} from "respvis-cartesian";
import {
  ErrorMessages,
  ScaledValuesCategorical,
  ScaledValuesCategoricalUserArgs,
  ScaledValuesNumericUserArgs
} from "respvis-core";
import {Bar, BarLabelsDataCollection, BarLabelsUserArg} from "respvis-bar";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import {BarBaseSeries} from "./bar-base-series";

export type BarBaseSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  x: ScaledValuesCategoricalUserArgs
  y: ScaledValuesNumericUserArgs
  original?: BarBaseSeries
  labels?: BarLabelsUserArg
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGRectElement, Bar>
}
export type BarBaseSeriesArgs = BarBaseSeriesUserArgs & CartesianSeriesArgs
export type BarBaseSeriesData = CartesianSeriesData & {
  x: ScaledValuesCategorical
  labels?: BarLabelsDataCollection
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGRectElement, Bar>
}

export function validateBarBaseSeriesArgs(args: BarBaseSeriesArgs): BarBaseSeriesData {
  const cartesianData = validateCartesianSeriesArgs(args) as CartesianSeriesData & { x: ScaledValuesCategorical }
  if (!(cartesianData.x instanceof ScaledValuesCategorical)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
  return {
    ...cartesianData,
    markerTooltipGenerator: args.markerTooltipGenerator,
    labels: args.labels ? new BarLabelsDataCollection(args.labels) : undefined
  }
}
