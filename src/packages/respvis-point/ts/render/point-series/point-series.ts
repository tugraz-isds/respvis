import {RadiusArg} from "respvis-core";
import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {PointLabelsDataCollection, PointLabelsUserArgs} from "../point-label";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import type {Point} from "../point";

export type PointSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  radii?: RadiusArg
  labels?: PointLabelsUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
}

export type PointSeriesArgs = PointSeriesUserArgs & CartesianSeriesArgs

export class PointSeries extends CartesianSeries {
  radii: RadiusArg
  labels?: PointLabelsDataCollection
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
  //TODO: Do clean radius validation
  constructor(args: PointSeriesArgs | PointSeries) {
    super(args)
    this.radii = args.radii ?? 5
    this.markerTooltipGenerator = args.markerTooltipGenerator

    if ('class' in args) this.labels = args.labels
    else if (args.labels) this.labels = new PointLabelsDataCollection(args.labels)
  }

  clone() {
    return new PointSeries(this)
  }
}

