import {CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {clonePointSeriesData, type Point, PointLabelsUserArgs, PointSeries, RadiusUserArgs} from "respvis-point";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import {DataSeries} from "respvis-core";

export type LineSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  labels?: PointLabelsUserArgs
  radii?: RadiusUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
}

export type LineSeriesArgs = LineSeriesUserArgs & Omit<CartesianSeriesArgs, 'original'> & {
}

export class LineSeries extends PointSeries {

  cloneToRenderData() {
    this.renderData = clonePointSeriesData(this.originalData)
    return this
  }

  applyZoom(): PointSeries {
    return super.applyZoom() as PointSeries
  }

  applyFilter(): PointSeries {
    return super.applyFilter() as PointSeries
  }

  applyInversion(): DataSeries {
    throw new Error("Method not implemented.");
  }
}

