import {
  alignScaledValuesLengths,
  AxisType,
  BaseAxis,
  combineKeys,
  DataSeries,
  DataSeriesArgs,
  DataSeriesUserArgs,
  ErrorMessages,
  getCurrentResponsiveValue,
  ScaledValuesCategorical,
  ScaledValuesSpatial,
  ScaledValuesSpatialDomain,
  ScaledValuesSpatialUserArgs,
  SVGHTMLElementLegacy,
  validateScaledValuesSpatial,
  validateZoom,
  Zoom,
  ZoomArgs
} from "respvis-core";
import {CartesianResponsiveState} from "./cartesian-responsive-state";
import {CartesianRenderer} from "../cartesian-chart/cartesian-renderer";
import {CartesianAxis} from "../validate-cartesian-axis";
import {Selection} from "d3";

export type CartesianSeriesUserArgs = DataSeriesUserArgs & {
  x: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>
  y: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>
  zoom?: ZoomArgs
}

export type CartesianSeriesArgs = DataSeriesArgs & CartesianSeriesUserArgs & {
  originalSeries?: CartesianSeries
}

export abstract class CartesianSeries extends DataSeries {
  originalSeries: CartesianSeries
  x: ScaledValuesSpatial
  y: ScaledValuesSpatial
  responsiveState: CartesianResponsiveState
  zoom?: Zoom
  renderer: CartesianRenderer

  protected constructor(args: CartesianSeriesArgs | CartesianSeries) {
    super(args)
    this.originalSeries = args.originalSeries ?? this
    const [xAligned, yAligned] = ('tag' in args.x && 'tag' in args.y) ? [args.x, args.y] :
      alignScaledValuesLengths(args.x, args.y)
    this.x = 'tag' in xAligned ? xAligned : validateScaledValuesSpatial(xAligned, 'a-0')
    this.y = 'tag' in yAligned ? yAligned : validateScaledValuesSpatial(yAligned, 'a-1')

    this.responsiveState = 'class' in args ? args.responsiveState.clone({series: this}) :
      new CartesianResponsiveState({
        series: this,
        originalSeries: this.originalSeries,
        flipped: ('flipped' in args) ? args.flipped : false
      })
    this.zoom = 'class' in args ? args.zoom : args.zoom ? validateZoom(args.zoom) : undefined
    this.renderer = args.renderer as CartesianRenderer

    if (this.categories && this.categories.values.length !== this.x.values.length) {
      throw new Error(ErrorMessages.categoricalValuesMismatch)
    }

    if (this.color && this.color.values.length !== this.x.values.length) {
      throw new Error(ErrorMessages.sequentialColorValuesMismatch)
    }
  }

  getScaledValues() {
    return {x: this.x, y: this.y}
  }

  getCombinedKey(i: number) {
    const xKey = this.x instanceof ScaledValuesCategorical ? this.x.getCategoryData(i).combinedKey : undefined
    const yKey = this.y instanceof ScaledValuesCategorical ? this.y.getCategoryData(i).combinedKey : undefined
    const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
    return combineKeys([this.key, seriesCategoryKey, xKey, yKey])
  }

  getScaledValuesAtScreenPosition(x: number, y: number) {
    function getAxisData(axisS: Selection<SVGHTMLElementLegacy, CartesianAxis>) {
      const axis = axisS.datum()
      const scaleFormat = axis.scaledValues.tag !== 'categorical' ? axis.scaledValues.scale.tickFormat() : (h => h)
      return {
        format: axis.d3Axis?.tickFormat() ?? scaleFormat,
        title: getCurrentResponsiveValue(axis.title, {
          self: axisS,
          chart: axis.renderer.chartS
        })
      }
    }

    const horizontal = getAxisData(this.renderer.horizontalAxisS)
    const vertical = getAxisData(this.renderer.verticalAxisS)
    return {
      horizontal: horizontal.format(this.renderer.horizontalAxisS.datum().scaledValues.atScreenPosition(x), 0),
      vertical: vertical.format(this.renderer.verticalAxisS.datum().scaledValues.atScreenPosition(y), 0),
      horizontalName: horizontal.title, verticalName: vertical.title
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
    if (this.color) {
      const colorFiltered = this.color.axis.scaledValues.cloneFiltered()
      const axis: BaseAxis = {...this.color.axis, scaledValues: colorFiltered}
      clone.color = {...this.color, axis}
    }
    if (this.categories) {
      clone.categories = this.categories.cloneFiltered()
    }
    return clone
  }

  abstract clone(): CartesianSeries
}
