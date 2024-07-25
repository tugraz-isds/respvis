import {ResponsiveState, ResponsiveStateArgs} from "respvis-core";
import {CartesianSeries} from "./cartesian-series";
import {handleZoom} from "./handle-zoom";

export type CartesianResponsiveStateArgs = ResponsiveStateArgs & {
  series: CartesianSeries
}

export class CartesianResponsiveState extends ResponsiveState {
  protected _series: CartesianSeries

  constructor(args: CartesianResponsiveStateArgs) {
    super(args)
    this._series = args.series
  }
  horizontalVals() {
    return this.currentlyFlipped ? this._series.renderData.y : this._series.renderData.x
  }

  verticalVals() {
    return this.currentlyFlipped ? this._series.renderData.x : this._series.renderData.y
  }

  update() {
    super.update();
    let {horizontal, vertical} = this.drawAreaRange()

    const inversionState = this._series.renderer.updateAxisInversionState()
    if (inversionState.horizontal) horizontal.reverse()
    if (inversionState.vertical) vertical.reverse()

    const [xOrientation, yOrientation] = this.currentlyFlipped ? ['vertical', 'horizontal'] as const : ['horizontal', 'vertical'] as const
    this._series.originalData.x.updateRange(horizontal, vertical, xOrientation)
    this._series.originalData.y.updateRange(horizontal, vertical, yOrientation)
    handleZoom(this._series)
  }
}
