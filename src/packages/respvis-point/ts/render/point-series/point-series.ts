import {DataSeries, LegendSelection} from "respvis-core";
import {CartesianRenderer, CartesianSeries} from "respvis-cartesian";
import {PointResponsiveState} from "./point-responsive-state";
import {renderRadiusScale} from "./render-radius-scale";
import {clonePointSeriesData, PointSeriesArgs, PointSeriesData, validatePointSeriesArgs} from "./validate-point-series";

export class PointSeries extends CartesianSeries {
  renderer: CartesianRenderer
  originalData: PointSeriesData
  renderData: PointSeriesData
  responsiveState: PointResponsiveState

  constructor(args: PointSeriesArgs) {
    super()
    this.originalData = validatePointSeriesArgs(args, this)
    this.renderData = this.originalData
    this.renderer = args.renderer
    this.responsiveState = new PointResponsiveState({
      series: this,
      flipped: ('flipped' in args) ? args.flipped : false
    })
  }

  renderLegendInfo(legendS: LegendSelection) {
    renderRadiusScale(legendS, this)
  }

  cloneToRenderData() {
    this.renderData = clonePointSeriesData(this.originalData)
    return this
  }

  applyZoom(): PointSeries {
    return super.applyZoom() as PointSeries
  }

  applyFilter(): PointSeries {
    return super.applyFilter() as PointSeries
    //TODO
    // if (typeof clone.radii === 'object' && 'tag' in clone.radii) {
    //   const scaledValues = clone.radii.axis.scaledValues.cloneFiltered()
    //   const axis: BaseAxis = {...clone.radii.axis, scaledValues}
    //   clone.radii = {...clone.radii, axis}
    // }
  }

  applyInversion(): DataSeries {
    throw new Error("Method not implemented.");
  }
}
