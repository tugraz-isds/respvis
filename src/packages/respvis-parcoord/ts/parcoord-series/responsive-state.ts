import {AxisLayout, ResponsiveState, ResponsiveStateArgs} from "respvis-core";
import {ParcoordSeries} from "./parcoord-series";

type ParcoordResponsiveStateArgs = ResponsiveStateArgs & {
  series: ParcoordSeries
  originalSeries: ParcoordSeries
}

export class ParcoordResponsiveState extends ResponsiveState {
  protected _series: ParcoordSeries
  protected _originalSeries: ParcoordSeries
  protected _axisLayout: AxisLayout

  constructor(args: ParcoordResponsiveStateArgs) {
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

  update() {
    super.update();
    const {horizontal, vertical} = this.drawAreaRange()
    const currentAxesSpaceRange = this.currentlyFlipped ? vertical : horizontal

    this._axisLayout = this.currentlyFlipped ? 'bottom' : 'left'
    const orientation = this.currentlyFlipped ? 'horizontal' : 'vertical'

    const {axes, axesScale, percentageScreenScale} = this._originalSeries
    axes.forEach(axis => axis.scaledValues.updateRange(horizontal, vertical, orientation))
    percentageScreenScale.range(currentAxesSpaceRange)
    axesScale.range(currentAxesSpaceRange)
  }

  cloneProps(): ParcoordResponsiveStateArgs {
    return { ...super.cloneProps(), series: this._series, originalSeries: this._originalSeries }
  }

  clone(args?: Partial<ParcoordResponsiveStateArgs>) {
    return new ParcoordResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
