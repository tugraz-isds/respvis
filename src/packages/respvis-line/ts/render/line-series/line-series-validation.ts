import {CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {type Point, PointLabelsUserArgs, PointSeries, RadiusUserArgs} from "respvis-point";
import {SeriesTooltipGenerator} from "respvis-tooltip";

export type LineSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  labels?: PointLabelsUserArgs
  radii?: RadiusUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
}

export type LineSeriesArgs = LineSeriesUserArgs & Omit<CartesianSeriesArgs, 'originalSeries'> & {
  originalSeries?: LineSeries
}

export class LineSeries extends PointSeries {
  originalSeries: LineSeries

  constructor(args: LineSeriesArgs | LineSeries) {
    super(args);
    this.originalSeries = args.originalSeries ?? this
  }

  clone() {
    return new LineSeries(this)
  }
}

