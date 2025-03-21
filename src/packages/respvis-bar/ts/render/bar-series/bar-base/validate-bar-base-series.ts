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
import {Bar} from "../../bar";
import {BarLabelsDataCollection, BarLabelsUserArg} from "../../bar-label";
import {DataSeriesTooltipGenerator} from "respvis-tooltip";
import {BarBaseSeries} from "./bar-base-series";

export type BarBaseSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  x: ScaledValuesCategoricalUserArgs
  y: ScaledValuesNumericUserArgs
  original?: BarBaseSeries
  labels?: BarLabelsUserArg
  markerTooltipGenerator?: DataSeriesTooltipGenerator<SVGRectElement, Bar>
}
export type BarBaseSeriesArgs = BarBaseSeriesUserArgs & CartesianSeriesArgs
export type BarBaseSeriesData = CartesianSeriesData & {
  x: ScaledValuesCategorical
  labels?: BarLabelsDataCollection
  markerTooltipGenerator?: DataSeriesTooltipGenerator<SVGRectElement, Bar>
}

export function validateBarBaseSeriesArgs(args: BarBaseSeriesArgs, series: BarBaseSeries): BarBaseSeriesData {
  const cartesianData = validateCartesianSeriesArgs(args, series) as CartesianSeriesData & { x: ScaledValuesCategorical }
  if (!(cartesianData.x instanceof ScaledValuesCategorical)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
  return {
    ...cartesianData,
    markerTooltipGenerator: args.markerTooltipGenerator,
    labels: args.labels ? new BarLabelsDataCollection(args.labels) : undefined
  }
}
