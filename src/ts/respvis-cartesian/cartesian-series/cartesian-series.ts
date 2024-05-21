import {
  alignScaledValuesLengths,
  AxisDomainRV,
  AxisType,
  combineKeys,
  ScaledValues,
  ScaledValuesCategorical,
  ScaledValuesUserArgs,
  Series,
  SeriesArgs,
  SeriesUserArgs,
  validateScaledValuesAxis,
  ZoomArgs,
  ZoomValid,
  zoomValidation
} from "respvis-core";
import {CartesianSeriesResponsiveState} from "./responsive-state";
import {CartesianRenderer} from "../cartesian-renderer";

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
  renderer: CartesianRenderer

  constructor(args: CartesianSeriesArgs | CartesianSeries) {
    super(args)
    this.originalSeries = args.originalSeries ?? this
    const [xAligned, yAligned] = ('tag' in args.x && 'tag' in args.y) ? [args.x, args.y] :
      alignScaledValuesLengths(args.x, args.y)
    this.x = 'tag' in xAligned ? xAligned : validateScaledValuesAxis(xAligned, 'a-0')
    this.y = 'tag' in yAligned ? yAligned : validateScaledValuesAxis(yAligned, 'a-1')

    this.responsiveState = 'class' in args ? args.responsiveState.clone({series: this}) :
      new CartesianSeriesResponsiveState({
        series: this,
        originalSeries: this.originalSeries,
        flipped: ('flipped' in args) ? args.flipped : false
      })
    this.zoom = 'class' in args ? args.zoom : args.zoom ? zoomValidation(args.zoom) : undefined
    this.renderer = args.renderer as CartesianRenderer
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
