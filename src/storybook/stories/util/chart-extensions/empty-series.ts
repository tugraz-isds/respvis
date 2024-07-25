import {
  DataSeries,
  DataSeriesArgs,
  DataSeriesData,
  Renderer,
  ResponsiveState,
  validateDataSeriesArgs
} from "respvis-core";

const placeholder = 'empty-series'

export class EmptySeries implements DataSeries {
  originalData: DataSeriesData;
  renderData: DataSeriesData;
  renderer: Renderer;
  responsiveState: ResponsiveState;

  constructor(args: DataSeriesArgs) {
    this.originalData = validateDataSeriesArgs(args)
    this.renderData = this.originalData
    this.renderer = args.renderer
    this.responsiveState = new ResponsiveState({
      series: this,
      flipped: ('flipped' in args) ? args.flipped : false
    })
  }

  cloneToRenderData() { return this };
  applyFilter() { return this };
  applyZoom() { return this };
  applyInversion() { return this };

  getScaledValuesAtScreenPosition() {
    return {horizontalName: placeholder, horizontal: placeholder, vertical: placeholder, verticalName: placeholder};
  }
}
