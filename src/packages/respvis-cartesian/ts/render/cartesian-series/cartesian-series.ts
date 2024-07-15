import {
  alignScaledValuesLengths,
  AxisType,
  BaseAxis,
  ErrorMessages,
  getCurrentResponsiveValue,
  RenderArgs,
  ScaledValuesCategorical,
  ScaledValuesSpatial,
  ScaledValuesSpatialArgs,
  ScaledValuesSpatialDomain,
  ScaledValuesSpatialUserArgs,
  Series,
  SeriesArgs,
  SeriesUserArgs,
  SVGHTMLElementLegacy,
  validateChartCategories,
  validateScaledValuesSpatial,
  validateZoom,
  Zoom,
  ZoomArgs
} from "respvis-core";
import {CartesianResponsiveState} from "./cartesian-responsive-state";
import {CartesianRenderer} from "../cartesian-chart/cartesian-renderer";
import {CartesianAxis} from "../validate-cartesian-axis";
import {Selection} from "d3";

export type CartesianSeriesUserArgs = SeriesUserArgs & {
  x: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>
  y: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>
  zoom?: ZoomArgs
}

export type CartesianSeriesArgs = Omit<CartesianSeriesUserArgs, 'x' | 'y'> & SeriesArgs & {
  x: ScaledValuesSpatial
  y: ScaledValuesSpatial
  originalSeries?: CartesianSeries
}

export function prepareCartesianSeriesArgs<T extends CartesianSeriesUserArgs & RenderArgs>(args: T) {

  const [cs, cx, cy] =
    validateChartCategories([args.categories, args.x, args.y])

  const xArgs = cx ? {...args.x, categories: cx} : args.x as ScaledValuesSpatialArgs<any>
  const yArgs = cy ? {...args.y, categories: cy} : args.y as ScaledValuesSpatialArgs<any>
  const categoriesArgs = (cs && args.categories) ? {...args.categories, categories: cs} : undefined

  const [xAligned, yAligned] = alignScaledValuesLengths(xArgs, yArgs)
  //TODO: align categories

  const seriesArgs = {...args,
    key: args.key ?? 0,
    categories: categoriesArgs ? validateScaledValuesSpatial(categoriesArgs) as ScaledValuesCategorical : undefined,
    x: validateScaledValuesSpatial(xAligned),
    y: validateScaledValuesSpatial(yAligned)
  }

  if (seriesArgs.categories && seriesArgs.categories.values.length !== seriesArgs.x.values.length) {
    throw new Error(ErrorMessages.categoricalValuesMismatch)
  }

  return seriesArgs
}

export abstract class CartesianSeries extends Series {
  originalSeries: CartesianSeries
  x: ScaledValuesSpatial
  y: ScaledValuesSpatial
  categories?: ScaledValuesCategorical
  responsiveState: CartesianResponsiveState
  zoom?: Zoom
  renderer: CartesianRenderer

  protected constructor(args: CartesianSeriesArgs | CartesianSeries) {
    super(args)
    this.originalSeries = args.originalSeries ?? this
    this.x = args.x
    this.y = args.y
    this.categories = args.categories
    this.zoom = 'class' in args ? args.zoom : args.zoom ? validateZoom(args.zoom) : undefined
    this.renderer = args.renderer as CartesianRenderer

    this.responsiveState = 'class' in args ? args.responsiveState.clone({series: this}) :
      new CartesianResponsiveState({
        series: this,
        originalSeries: this.originalSeries,
        flipped: ('flipped' in args) ? args.flipped : false
      })

    if (this.color && this.color.values.length !== this.x.values.length) {
      throw new Error(ErrorMessages.sequentialColorValuesMismatch)
    }
  }

  getScaledValues() {
    return {x: this.x, y: this.y}
  }

  getKeys(i: number) {
    const categoryKeys = this.categories ? this.categories.getKeys(i) : []
    return [this.key, ...this.x.getKeys(i), ...this.y.getKeys(i), ...categoryKeys]
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
