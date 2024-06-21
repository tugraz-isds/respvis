import {ResponsiveState, ResponsiveStateArgs} from "respvis-core";
import {CartesianSeries} from "./cartesian-series";
import {handleZoom} from "./handle-zoom";

export type CartesianResponsiveStateArgs = ResponsiveStateArgs & {
  series: CartesianSeries
  originalSeries: CartesianSeries
}

export class CartesianResponsiveState extends ResponsiveState {
  protected _series: CartesianSeries
  protected _originalSeries: CartesianSeries

  constructor(args: CartesianResponsiveStateArgs) {
    super(args)
    this._series = args.series
    this._originalSeries = args.originalSeries
  }
  horizontalVals() {
    return this.currentlyFlipped ? this._series.y : this._series.x
  }

  verticalVals() {
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

  cloneProps(): CartesianResponsiveStateArgs {
    const originalSeries = this._originalSeries
    return { ...super.cloneProps(), series: this._series, originalSeries }
  }

  clone(args?: Partial<CartesianResponsiveStateArgs>) {
    return new CartesianResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
