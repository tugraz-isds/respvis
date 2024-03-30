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
    const [xOrientation, yOrientation] = this.currentlyFlipped ? ['vertical', 'horizontal'] as const : ['horizontal', 'vertical'] as const
    this._originalSeries.x.updateRange(horizontal, vertical, xOrientation)
    this._originalSeries.y.updateRange(horizontal, vertical, yOrientation)
  }

  cloneProps(): CartesianSeriesResponsiveStateArgs {
    const originalSeries = this._originalSeries
    return { ...super.cloneProps(), series: this._series, originalSeries }
  }

  clone(args?: Partial<CartesianSeriesResponsiveStateArgs>) {
    return new CartesianSeriesResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
