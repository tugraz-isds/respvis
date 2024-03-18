import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "../../core/render/series/cartesian-series";
import {RectScaleHandler} from "../../core/data/scale/geometry-scale-handler/rect-scale-handler";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {ScaledValuesLinear} from "../../core/data/scale/scaled-values-linear";
import {ErrorMessages} from "../../core/utilities/error";
import {ScaledValuesCategoricalUserArgs} from "../../core/data/scale/scaled-values";

export type BarGroupedSeriesUserArgs = CartesianSeriesUserArgs & {
  type: 'grouped'
  x: ScaledValuesCategoricalUserArgs
}

export type BarGroupedSeriesArgs = BarGroupedSeriesUserArgs & CartesianSeriesArgs
export class BarGroupedSeries extends CartesianSeries {
  type: 'grouped'
  x: ScaledValuesCategorical
  y: ScaledValuesLinear
  geometryScaleHandler: RectScaleHandler

  constructor(args: BarGroupedSeriesArgs | BarGroupedSeries) {
    super(args);
    this.type = 'grouped'
    const { x, y } = this.getScaledValues()
    if(!(x instanceof ScaledValuesCategorical) ||
      !(y instanceof ScaledValuesLinear)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.x = x
    this.y = y
    this.geometryScaleHandler = new RectScaleHandler({
      originalXValues: this.x,
      originalYValues: this.y,
      renderer: this.renderer,
      flipped: this.flipped
    })
  }

  clone() {
    return new BarGroupedSeries(this)
  }
}
