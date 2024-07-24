import {LegendSelection} from "respvis-core";
import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {PointLabelsDataCollection, PointLabelsUserArgs} from "../point-label";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import type {Point} from "../point";
import {PointResponsiveState} from "./point-responsive-state";
import {renderRadiusScale} from "./render-radius-scale";
import {
  isBaseRadiusUserArgs,
  Radius,
  RadiusUserArgs,
  validateBaseRadius,
  validateBubbleRadius
} from "../../data/radius";

export type PointSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  radii?: RadiusUserArgs
  original?: PointSeries
  labels?: PointLabelsUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
}

export type PointSeriesArgs = PointSeriesUserArgs & CartesianSeriesArgs

export class PointSeries extends CartesianSeries {
  radii: Radius
  labels?: PointLabelsDataCollection
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGCircleElement, Point>
  responsiveState: PointResponsiveState
  original: PointSeries
  constructor(args: PointSeriesArgs | PointSeries) {
    super(args)
    this.original = args.original ?? this
    this.responsiveState = 'class' in args ? args.responsiveState.clone({series: this}) :
      new PointResponsiveState({
        series: this,
        originalSeries: this.original,
        flipped: ('flipped' in args) ? args.flipped : false
      })

    if ('class' in args) this.radii = args.radii
    else if (isBaseRadiusUserArgs(args.radii) || !args.radii) this.radii = validateBaseRadius(args.radii)
    else this.radii = validateBubbleRadius({...args.radii, renderer: this.renderer, series: this})

    this.markerTooltipGenerator = args.markerTooltipGenerator

    if ('class' in args) this.labels = args.labels
    else if (args.labels) this.labels = new PointLabelsDataCollection(args.labels)
  }

  renderLegendInfo(legendS: LegendSelection) {
    super.renderLegendInfo(legendS)
    renderRadiusScale(legendS, this)
  }

  cloneFiltered(): PointSeries {
    const clone = super.cloneFiltered() as PointSeries
    //TODO
    // if (typeof clone.radii === 'object' && 'tag' in clone.radii) {
    //   const scaledValues = clone.radii.axis.scaledValues.cloneFiltered()
    //   const axis: BaseAxis = {...clone.radii.axis, scaledValues}
    //   clone.radii = {...clone.radii, axis}
    // }
    return clone
  }

  clone() {
    return new PointSeries(this)
  }
}

