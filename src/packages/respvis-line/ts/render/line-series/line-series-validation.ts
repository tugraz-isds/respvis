import {CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {type Point, PointLabelsUserArgs, PointSeries, RadiusUserArgs} from "respvis-point";
import {SeriesTooltipGenerator} from "respvis-tooltip";

export type LineSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  labels?: PointLabelsUserArgs
  radii?: RadiusUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
}

export type LineSeriesArgs = LineSeriesUserArgs & Omit<CartesianSeriesArgs, 'original'> & {
  original?: LineSeries
}

export class LineSeries extends PointSeries {
  original: LineSeries

  constructor(args: LineSeriesArgs | LineSeries) {
    super(args);
    this.original = args.original ?? this
  }

  clone() {
    return new LineSeries(this)
  }
}

