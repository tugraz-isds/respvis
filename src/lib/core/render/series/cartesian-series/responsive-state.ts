import {SeriesResponsiveState, SeriesResponsiveStateArgs} from "../responsive-state";
import {CartesianSeries} from "./cartesian-series";

type CartesianSeriesResponsiveStateArgs = SeriesResponsiveStateArgs & {
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
  update() {
    super.update();
    const {horizontal, vertical} = this.drawAreaRange()
    const currentYRange = this.currentlyFlipped ? horizontal : vertical
    const currentXRange = this.currentlyFlipped ? vertical : horizontal
    this._originalSeries.x.scale.range(currentXRange)
    this._originalSeries.y.scale.range(currentYRange)
  }

  cloneProps(): CartesianSeriesResponsiveStateArgs {
    const originalSeries = this._originalSeries
    return { ...super.cloneProps(), series: this._series, originalSeries }
  }

  clone(args?: Partial<CartesianSeriesResponsiveStateArgs>) {
    return new CartesianSeriesResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
