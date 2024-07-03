import {CartesianSeries, CartesianSeriesArgs, CartesianSeriesUserArgs} from "respvis-cartesian";
import {
  defaultStyleClass,
  ErrorMessages,
  Key,
  Rect,
  ScaledValuesCategorical,
  ScaledValuesCategoricalUserArgs
} from "respvis-core";
import {Bar} from "../../bar";
import {BarBaseResponsiveState} from "./bar-base-responsive-state";
import {BarLabelsDataCollection, BarLabelsUserArg} from "../../bar-label";
import {SeriesTooltipGenerator} from "respvis-tooltip";

export type BarBaseSeriesUserArgs = Omit<CartesianSeriesUserArgs, 'markerTooltipGenerator'> & {
  x: ScaledValuesCategoricalUserArgs
  originalSeries?: BarBaseSeries
  labels?: BarLabelsUserArg
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGRectElement, Bar>
}

export type BarBaseSeriesArgs = BarBaseSeriesUserArgs & CartesianSeriesArgs

export abstract class BarBaseSeries extends CartesianSeries {
  x: ScaledValuesCategorical
  responsiveState: BarBaseResponsiveState
  originalSeries: BarBaseSeries
  labels?: BarLabelsDataCollection
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGRectElement, Bar>
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
    else if (args.labels) this.labels = new BarLabelsDataCollection(args.labels)
    this.markerTooltipGenerator = args.markerTooltipGenerator
  }

  getBarRects(): Bar[] {
    const data: Bar[] = []
    const {x, y, color} = this
    const optionalColorValues = color?.axis.scaledValues

    if (!this.keysActive[this.key]) return data
    for (let i = 0; i < this.y.values.length; ++i) {
      if (this.categories && !this.categories.isValueActive(i)) continue
      if (!x.isValueActive(i) || !y.isValueActive(i) || !(optionalColorValues?.isValueActive(i) ?? true)) continue
      const category = this.categories?.values[i]
      data.push(new Bar({
        ...this.getRect(i),
        xValue: this.x.values[i],
        yValue: this.y.values[i],
        styleClass: this.categories?.getStyleClass(i) ?? defaultStyleClass,
        category,
        categoryFormatted: category ? this.categories?.categories.categoryMap[category].formatValue : undefined,
        label: this.labels?.at(i),
        key: new Key(this.getCombinedKey(i) + ` i-${i}`),
      }));
    }
    return data
  }

  abstract getRect(i: number): Rect
}
