import {
  CartesianSeriesArgs,
  CartesianSeriesData,
  CartesianSeriesUserArgs,
  cloneCartesianSeriesData,
  validateCartesianSeriesArgs
} from "respvis-cartesian";
import {isBaseRadiusUserArgs, Radius, RadiusUserArgs, validateBaseRadius, validateBubbleRadius} from "../../data";
import {PointLabelsDataCollection, PointLabelsUserArgs} from "../point-label";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import type {Point} from "../point";
import {PointSeries} from "./point-series";

export type PointSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  radii?: RadiusUserArgs
  original?: PointSeries
  labels?: PointLabelsUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
}
export type PointSeriesArgs = PointSeriesUserArgs & CartesianSeriesArgs
export type PointSeriesData = CartesianSeriesData & {
  radii: Radius
  labels?: PointLabelsDataCollection
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
}

export function validatePointSeriesArgs(args: PointSeriesArgs, series: PointSeries): PointSeriesData {
  return {
    ...validateCartesianSeriesArgs(args),
    radii: (isBaseRadiusUserArgs(args.radii) || !args.radii) ? validateBaseRadius(args.radii) :
      validateBubbleRadius({...args.radii, renderer: args.renderer, series}),
    markerTooltipGenerator: args.markerTooltipGenerator,
    labels: args.labels ? new PointLabelsDataCollection(args.labels) : undefined,
  }
}

export function clonePointSeriesData(original: PointSeriesData) {
  return cloneCartesianSeriesData(original)
}
