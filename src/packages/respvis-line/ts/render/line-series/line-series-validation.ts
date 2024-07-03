import {CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {type Point, PointLabelsUserArgs, PointSeries} from "respvis-point";
import {InterpolatedRadius, InterpolatedRadiusUserArgs, validateBreakpointProperty} from "respvis-core";
import {SeriesTooltipGenerator} from "respvis-tooltip";

export type LineSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  labels?: PointLabelsUserArgs
  radii?: InterpolatedRadiusUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
}

export type LineSeriesArgs = LineSeriesUserArgs & Omit<CartesianSeriesArgs, 'originalSeries'> & {
  originalSeries?: LineSeries
}

export class LineSeries extends PointSeries {
  radii: InterpolatedRadius
  originalSeries: LineSeries
  constructor(args: LineSeriesArgs | LineSeries) {
    super(args);
    this.originalSeries = args.originalSeries ?? this
    if ('class' in args) this.radii = args.radii
    else this.radii = args.radii ? validateBreakpointProperty(args.radii) : 5
  }
  clone() {
    return new LineSeries(this)
  }
}

