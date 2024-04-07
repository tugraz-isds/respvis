import {AxisDomainRV, axisScaledValuesValidation} from "../../../data/scale/axis-scaled-values-validation";
import {alignScaledValuesLengths, ScaledValuesUserArgs} from "../../../data/scale/scaled-values";
import {combineKeys} from "../../../utilities/dom/key";
import {ScaledValues} from "../../../data/scale/scaled-values-base";
import {ScaledValuesCategorical} from "../../../data/scale/scaled-values-categorical";
import {Series, SeriesArgs, SeriesUserArgs} from "../index";
import {CartesianSeriesResponsiveState} from "./responsive-state";
import {ZoomArgs, ZoomValid, zoomValidation} from "../../../data/zoom";
import {AxisType} from "../../../constants/types";

export type CartesianSeriesUserArgs = SeriesUserArgs & {
  x: ScaledValuesUserArgs<AxisDomainRV>
  y: ScaledValuesUserArgs<AxisDomainRV>
  zoom?: ZoomArgs
}

export type CartesianSeriesArgs = SeriesArgs & CartesianSeriesUserArgs & {
  originalSeries?: CartesianSeries
}

export class CartesianSeries extends Series {
  originalSeries: CartesianSeries
  x: ScaledValues
  y: ScaledValues
  responsiveState: CartesianSeriesResponsiveState
  zoom?: ZoomValid

  constructor(args: CartesianSeriesArgs | CartesianSeries) {
    super(args)
    this.originalSeries = args.originalSeries ?? this
    const [xAligned, yAligned] = ('tag' in args.x && 'tag' in args.y) ? [args.x, args.y] :
      alignScaledValuesLengths(args.x, args.y)
    this.x = 'tag' in xAligned ? xAligned : axisScaledValuesValidation(xAligned, 'a-0')
    this.y = 'tag' in yAligned ? yAligned : axisScaledValuesValidation(yAligned, 'a-1')

    this.responsiveState = 'class' in args ? args.responsiveState.clone({series: this}) :
      new CartesianSeriesResponsiveState({
        series: this,
        originalSeries: this.originalSeries,
        flipped: ('flipped' in args) ? args.flipped : false
      })
    this.zoom = 'class' in args ? args.zoom : args.zoom ? zoomValidation(args.zoom) : undefined
  }

  getScaledValues() { return {x: this.x, y: this.y} }

  getCombinedKey(i: number) {
    const xKey = this.x instanceof ScaledValuesCategorical ? this.x.getCategoryData(i).combinedKey : undefined
    const yKey = this.y instanceof ScaledValuesCategorical ? this.y.getCategoryData(i).combinedKey : undefined
    const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
    return combineKeys([this.key, seriesCategoryKey, xKey, yKey])
  }

  getScaledValuesAtScreenPosition(x: number, y: number) {
    return {
      x: this.x.scaledValueAtScreenPosition(x),
      y: this.y.scaledValueAtScreenPosition(y)
    }
  }

  cloneZoomed() {
    if (!this.zoom) return this.clone()
    const [xDirection, yDirection]: [AxisType, AxisType] =
      this.responsiveState.currentlyFlipped ? ['y', 'x'] : ['x', 'y']
    const xZoomed = this.x.cloneZoomed(this.zoom.currentTransform, xDirection)
    const yZoomed = this.y.cloneZoomed(this.zoom.currentTransform, yDirection)
    const clone = this.clone()
    clone.x = xZoomed
    clone.y = yZoomed
    return clone
  }

  cloneFiltered() {
    const clone = this.clone()
    clone.x = this.x.cloneFiltered()
    clone.y = this.y.cloneFiltered()
    return clone
  }

  clone() {
    return new CartesianSeries({...this})
  }
}
