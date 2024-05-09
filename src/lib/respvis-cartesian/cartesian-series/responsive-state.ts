import {SeriesResponsiveState, SeriesResponsiveStateArgs} from "respvis-core";
import {CartesianSeries} from "./cartesian-series";
import {handleZoom} from "./handle-zoom";

export type CartesianSeriesResponsiveStateArgs = SeriesResponsiveStateArgs & {
  series: CartesianSeries
  originalSeries: CartesianSeries
}

export class CartesianSeriesResponsiveState extends SeriesResponsiveState {
  protected _series: CartesianSeries
  protected _originalSeries: CartesianSeries

  constructor(args: CartesianSeriesResponsiveStateArgs) {
    super(args)
    this._series = args.series
    this._originalSeries = args.originalSeries
  }
  currentXVals() {
    return this.currentlyFlipped ? this._series.y : this._series.x
  }

  currentYVals() {
    return this.currentlyFlipped ? this._series.x : this._series.y
  }
  update() {
    super.update();
    const {horizontal, vertical} = this.drawAreaRange()
    const [xOrientation, yOrientation] = this.currentlyFlipped ? ['vertical', 'horizontal'] as const : ['horizontal', 'vertical'] as const
    this._originalSeries.x.updateRange(horizontal, vertical, xOrientation)
    this._originalSeries.y.updateRange(horizontal, vertical, yOrientation)
    handleZoom(this._series)
  }

  cloneProps(): CartesianSeriesResponsiveStateArgs {
    const originalSeries = this._originalSeries
    return { ...super.cloneProps(), series: this._series, originalSeries }
  }

  clone(args?: Partial<CartesianSeriesResponsiveStateArgs>) {
    return new CartesianSeriesResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
