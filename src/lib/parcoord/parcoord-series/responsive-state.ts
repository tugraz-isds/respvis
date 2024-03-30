import {SeriesResponsiveState, SeriesResponsiveStateArgs} from "../../core/render/series/responsive-state";
import {ParcoordSeries} from "./parcoord-series";
import {AxisLayout} from "../../core/constants/types";

type ParcoordSeriesResponsiveStateArgs = SeriesResponsiveStateArgs & {
  series: ParcoordSeries
  originalSeries: ParcoordSeries
}

export class ParcoordSeriesResponsiveState extends SeriesResponsiveState {
  protected _series: ParcoordSeries
  protected _originalSeries: ParcoordSeries
  protected _axisLayout: AxisLayout

  constructor(args: ParcoordSeriesResponsiveStateArgs) {
    super(args);
    this._series = args.series
    this._originalSeries = args.originalSeries
    this._axisLayout = this.currentlyFlipped ? 'bottom' : 'left'
  }

  get axisLayout() { return this._axisLayout }

  getAxisPosition(axisIndex: number) {
    const axis = this._series.axes[axisIndex]
    const percentage = this._series.axesPercentageScale(axis.key) ?? 0
    return this.currentlyFlipped ? { x: 0, y: this._series.percentageScreenScale(percentage)} :
      { x: this._series.percentageScreenScale(percentage), y: 0 }
  }

  // getAxisRange(axisIndex: number) {
  //   const inverted = this._series.axesInverted[axisIndex]
  //   const range = this._series.axes[axisIndex].scaledValues.scale.range()
  //   return inverted ? [range[1], range[0]] : [range[], range[0]]
  //   const rangeMax = this._series.axes[axisIndex].scaledValues.scale.range()[inverted ? 1 : 0]
  //   return this.currentlyFlipped ? { x: 0, y: this._series.percentageScreenScale(percentage)} :
  //     { x: this._series.percentageScreenScale(percentage), y: 0 }
  // }

  update() {
    super.update();
    const {horizontal, vertical} = this.drawAreaRange()
    const currentSingleAxisRange = this.currentlyFlipped ? horizontal : vertical
    const currentAxesSpaceRange = this.currentlyFlipped ? vertical : horizontal
    this._axisLayout = this.currentlyFlipped ? 'bottom' : 'left'

    const {axes, axesScale, percentageScreenScale} = this._originalSeries
    axes.forEach(axis => axis.scaledValues.scale.range(currentSingleAxisRange))
    percentageScreenScale.range(currentAxesSpaceRange)
    axesScale.range(currentAxesSpaceRange)
  }

  cloneProps(): ParcoordSeriesResponsiveStateArgs {
    return { ...super.cloneProps(), series: this._series, originalSeries: this._originalSeries }
  }

  clone(args?: Partial<ParcoordSeriesResponsiveStateArgs>) {
    return new ParcoordSeriesResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
