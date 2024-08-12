import {AxisType, Orientation, ResponsiveState, ResponsiveStateArgs} from "respvis-core";
import {CartesianSeries} from "./cartesian-series";
import {handleZoom} from "./handle-zoom";

export type CartesianResponsiveStateArgs = ResponsiveStateArgs & {
  series: CartesianSeries
}

export class CartesianResponsiveState extends ResponsiveState {
  protected _series: CartesianSeries
  protected _inversionState: Record<AxisType | Orientation, boolean> = {
    horizontal: false, vertical: false, x: false, y: false
  }

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

    this.updateInversionState()

    if (this._inversionState.horizontal) horizontal.reverse()
    if (this._inversionState.vertical) vertical.reverse()

    const [xOrientation, yOrientation] = this.currentlyFlipped ? ['vertical', 'horizontal'] as const : ['horizontal', 'vertical'] as const
    this._series.originalData.x.updateRange(horizontal, vertical, xOrientation)
    this._series.originalData.y.updateRange(horizontal, vertical, yOrientation)
    handleZoom(this._series)
  }

  updateInversionState() {
    const inversionState = this._series.renderer.getAxisInversionState()
    const horizontalAxisS = this._series.renderer.horizontalAxisS
    const verticalAxisS = this._series.renderer.verticalAxisS

    this._series.originalData.x.inverted = inversionState.x
    this._series.originalData.y.inverted = inversionState.y
    if (!horizontalAxisS.empty()) horizontalAxisS.datum().scaledValues.inverted = inversionState.horizontal
    if (!verticalAxisS.empty()) verticalAxisS.datum().scaledValues.inverted = inversionState.vertical

    this._inversionState = {
      horizontal: inversionState.horizontal,
      vertical: inversionState.vertical,
      x: this.currentlyFlipped ? inversionState.vertical : inversionState.horizontal,
      y: this.currentlyFlipped ? inversionState.horizontal : inversionState.vertical,
    }
  }
}
