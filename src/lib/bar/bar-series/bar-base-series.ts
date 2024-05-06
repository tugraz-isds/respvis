import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "core/render/series/cartesian-series";
import {ScaledValuesCategoricalUserArgs} from "core/data/scale/scaled-values";
import {ScaledValuesCategorical} from "core/data/scale/scaled-values-categorical";
import {ErrorMessages} from "core/utilities/error";
import {Bar} from "../bar";
import {defaultStyleClass} from "core/constants/other";
import {Rect} from "core/utilities/graphic-elements/rect";
import {BarBaseResponsiveState} from "./bar-base-series/responsive-state";
import {BarLabelsUserArgs, BarLabelValues} from "../bar-label";

export type BarBaseSeriesUserArgs = CartesianSeriesUserArgs & {
  x: ScaledValuesCategoricalUserArgs
  originalSeries?: BarBaseSeries
  labels?: BarLabelsUserArgs
}

export type BarBaseSeriesArgs = BarBaseSeriesUserArgs & CartesianSeriesArgs

export abstract class BarBaseSeries extends CartesianSeries {
  x: ScaledValuesCategorical
  responsiveState: BarBaseResponsiveState
  originalSeries: BarBaseSeries
  labels?: BarLabelValues
  protected constructor(args: BarBaseSeriesArgs | BarBaseSeries) {
    super(args);
    this.originalSeries = args.originalSeries ?? this
    const { x } = this.getScaledValues()
    if(!(x instanceof ScaledValuesCategorical)) throw new Error(ErrorMessages.invalidScaledValuesCombination)
    this.x = x
    this.responsiveState = 'class' in args ? args.responsiveState.clone({series: this}) :
      new BarBaseResponsiveState({
        series: this,
        originalSeries: this.originalSeries,
        flipped: ('flipped' in args) ? args.flipped : false
      })

    if ('class' in args) this.labels = args.labels
    else if (args.labels) this.labels = new BarLabelValues(args.labels)
  }

  getBarRects(): Bar[] {
    const data: Bar[] = []
    const {x, y} = this

    if (!this.keysActive[this.key]) return data
    for (let i = 0; i < this.y.values.length; ++i) {
      if (this.categories && !this.categories.isValueActive(i)) continue
      if (!x.isValueActive(i) || !y.isValueActive(i)) continue
      data.push(new Bar({
        ...this.getRect(i),
        xValue: this.x.values[i],
        yValue: this.y.values[i],
        styleClass: this.categories?.categories.styleClassValues[i] ?? defaultStyleClass,
        tooltipLabel: this.labelCallback(this.categories?.values[i] ?? ''),
        labelArg: this.labels?.getArgValid(i),
        key: this.getCombinedKey(i) + ` i-${i}`,
      }));
    }
    return data
  }

  abstract getRect(i: number): Rect
}
