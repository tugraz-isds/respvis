import {DataSeries} from "./data-series";
import {DataSeriesArgs, DataSeriesData, validateDataSeriesArgs} from "./validate-data-series";
import {Renderer} from "../chart/renderer";
import {ResponsiveState} from "./responsive-state";

const placeholder = 'empty-series'

export class EmptySeries implements DataSeries {
  originalData: DataSeriesData;
  renderData: DataSeriesData;
  renderer: Renderer;
  responsiveState: ResponsiveState;

  constructor(args: DataSeriesArgs) {
    this.originalData = validateDataSeriesArgs(args, this)
    this.renderData = this.originalData
    this.renderer = args.renderer
    this.responsiveState = new ResponsiveState({
      series: this,
      flipped: ('flipped' in args) ? args.flipped : false
    })
  }

  cloneToRenderData() {
    return this
  };

  applyFilter() {
    return this
  };

  applyZoom() {
    return this
  };

  applyInversion() {
    return this
  };

  getScaledValuesAtScreenPosition() {
    return {
      horizontal: placeholder,
      horizontalName: placeholder,
      horizontalNearestRealValue: placeholder,
      horizontalScreenValue: placeholder,
      vertical: placeholder,
      verticalName: placeholder,
      verticalNearestRealValue: placeholder,
      verticalScreenValue: placeholder
    };
  }
}
