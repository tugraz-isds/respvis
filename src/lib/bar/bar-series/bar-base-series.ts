import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "../../core/render/series/cartesian-series";
import {ScaledValuesCategoricalUserArgs} from "../../core/data/scale/scaled-values";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {ErrorMessages} from "../../core/utilities/error";
import {Bar} from "./bar";
import {defaultStyleClass} from "../../core/constants/other";
import {Rect} from "../../core";
import {RectScaleHandler} from "../../core/data/scale/geometry-scale-handler/rect-scale-handler";

export type BarBaseSeriesUserArgs = CartesianSeriesUserArgs & {
  x: ScaledValuesCategoricalUserArgs
}

export type BarBaseSeriesArgs = BarBaseSeriesUserArgs & CartesianSeriesArgs

export abstract class BarBaseSeries extends CartesianSeries {
  x: ScaledValuesCategorical
  geometryScaleHandler: RectScaleHandler
  protected constructor(args: BarBaseSeriesArgs | BarBaseSeries) {
    super(args);
    const { x } = this.getScaledValues()
    if(!(x instanceof ScaledValuesCategorical)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.x = x
    this.geometryScaleHandler = new RectScaleHandler({
      originalXValues: this.x,
      originalYValues: this.y,
      renderer: this.renderer,
      flipped: this.flipped
    })
  }

  getBarRects(): Bar[] {
    const data: Bar[] = []
    const [x, y] = [this.x.cloneFiltered(), this.y.cloneFiltered()]
    this.geometryScaleHandler.originalXValues = x
    this.geometryScaleHandler.originalYValues = y

    if (!this.keysActive[this.key]) return data
    for (let i = 0; i < this.y.values.length; ++i) {
      if (this.categories && !this.categories.isKeyActiveByIndex(i)) continue
      if (!x.isKeyActiveByIndex(i) || !y.isKeyActiveByIndex(i)) continue

      data.push({
        ...this.getRect(i),
        xValue: this.x.values[i],
        yValue: this.y.values[i],
        styleClass: this.categories?.categories.styleClassValues[i] ?? defaultStyleClass,
        label: this.labelCallback(this.categories?.values[i] ?? ''),
        key: this.getCombinedKey(i) + ` i-${i}`,
      });
    }
    return data
  }

  abstract getRect(i: number): Rect
}
