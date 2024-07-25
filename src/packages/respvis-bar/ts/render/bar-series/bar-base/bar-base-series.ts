import {CartesianRenderer, CartesianSeries} from "respvis-cartesian";
import {defaultStyleClass, Key, Rect} from "respvis-core";
import {Bar} from "../../bar";
import {BarBaseResponsiveState} from "./bar-base-responsive-state";
import {BarBaseSeriesArgs, BarBaseSeriesData} from "./validate-bar-base-series";

export abstract class BarBaseSeries extends CartesianSeries {
  abstract originalData: BarBaseSeriesData
  abstract renderData: BarBaseSeriesData
  responsiveState: BarBaseResponsiveState
  renderer: CartesianRenderer

  protected constructor(args: BarBaseSeriesArgs) {
    super();
    this.responsiveState = new BarBaseResponsiveState({
      series: this,
      flipped: ('flipped' in args) ? args.flipped : false
    })
    this.renderer = args.renderer
  }

  getBars(): Bar[] {
    const data: Bar[] = []
    const {x, y, color,
      keysActive, key, categories, labels} = this.renderData

    const optionalColorValues = color?.axis.scaledValues
    if (!keysActive[key]) return data
    for (let i = 0; i < y.values.length; ++i) {
      if (categories && !categories.isValueActive(i)) continue
      if (!x.isValueActive(i) || !y.isValueActive(i) || !(optionalColorValues?.isValueActive(i) ?? true)) continue
      const category = categories?.values[i]
      data.push(new Bar({
        ...this.getRect(i),
        xValue: x.values[i],
        yValue: y.values[i],
        styleClass: categories?.getStyleClass(i) ?? defaultStyleClass,
        category,
        categoryFormatted: category ? categories?.categories.categoryMap[category].formatValue : undefined,
        label: labels?.at(i),
        key: new Key(this.renderData.getCombinedKey(i) + ` i-${i}`),
        inverted: y.inverted
      }));
    }
    return data
  }

  abstract getRect(i: number): Rect
}
