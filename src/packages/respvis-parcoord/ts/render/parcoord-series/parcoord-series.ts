import {
  AxisLayout,
  BaseAxisUserArgs,
  ErrorMessages,
  getCurrentResponsiveValue,
  RenderArgs,
  ResponsiveState,
  ResponsiveStateArgs,
  ScaledValuesCategorical,
  ScaledValuesSpatial,
  ScaledValuesSpatialArgs,
  ScaledValuesSpatialDomain,
  ScaledValuesSpatialUserArgs,
  Series,
  SeriesArgs,
  SeriesUserArgs,
  validateChartCategories,
  validateScaledValuesSpatial,
  validateZoom,
  Zoom,
  ZoomArgs
} from "respvis-core";
import {scaleLinear, ScaleLinear, scaleOrdinal, ScaleOrdinal, scalePoint, ScalePoint, Selection} from "d3";
import {renderTool} from "../parcoord-chart/render/render-tool";
import {KeyedAxis, validateKeyedAxis} from "../validate-keyed-axis";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import {Line} from "respvis-line";

export type ParcoordSeriesUserArgs = SeriesUserArgs & {
  dimensions: {
    scaledValues: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>
    axis: BaseAxisUserArgs
    zoom?: ZoomArgs
  }[],
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGRectElement, Line>
}

export type ParcoordArgs = SeriesArgs & Omit<ParcoordSeriesUserArgs, 'dimensions'> & {
  originalSeries?: ParcoordSeries
  zooms: (Zoom | undefined)[]
  dimensions: ScaledValuesSpatial[]
  axes: BaseAxisUserArgs[]
}

export function prepareParcoordSeriesArgs<T extends ParcoordSeriesUserArgs & RenderArgs>(args: T) {
  const [cs, ...cdim] =
    validateChartCategories([args.categories, ...args.dimensions.map(dim => dim.scaledValues)])

  //TODO: alignment of values
  const categoriesArgs = (cs && args.categories) ? {...args.categories, categories: cs} : undefined

  const dimArgs = cdim.map((cdimCurr, index) => {
    const scaledValuesArgs = cdimCurr ? {...args.dimensions[index].scaledValues, categories: cdimCurr} :
      args.dimensions[index].scaledValues as ScaledValuesSpatialArgs<any>
    return validateScaledValuesSpatial(scaledValuesArgs)
  })

  const zooms = args.dimensions.map(dimension => {
    return dimension.zoom ? validateZoom(dimension.zoom) : undefined
  })

  const axes = args.dimensions.map(dimension => dimension.axis)

  const seriesArgs = {...args,
    key: args.key ?? 0,
    categories: categoriesArgs ? validateScaledValuesSpatial(categoriesArgs) as ScaledValuesCategorical : undefined,
    dimensions: dimArgs,
    axes,
    zooms
  }

  if (categoriesArgs && categoriesArgs.values.length !== dimArgs.values.length) {
    throw new Error(ErrorMessages.categoricalValuesMismatch)
  }

  if (args.color && args.color.values.length !== dimArgs.values.length) {
    throw new Error(ErrorMessages.sequentialColorValuesMismatch)
  }

  return seriesArgs
}


export class ParcoordSeries extends Series {
  categories?: ScaledValuesCategorical | undefined;
  originalSeries: ParcoordSeries
  axes: KeyedAxis[]
  axesScale: ScalePoint<string>
  axesPercentageScale: ScaleOrdinal<string, number>
  percentageScreenScale: ScaleLinear<number, number>
  zooms: (Zoom | undefined)[]
  axesInverted: boolean[]
  responsiveState: ParcoordResponsiveState
  providesTool = true
  //TODO: implement usage and initialization of markerTooltipGenerator for parcoords
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGRectElement, Line>

  constructor(args: ParcoordArgs | ParcoordSeries) {
    super(args)
    const {renderer} = args
    this.originalSeries = args.originalSeries ?? this

    this.axes = 'class' in args ? args.axes :
      args.dimensions.map((dimension, index) => {
        return validateKeyedAxis({
          ...args.axes[index], renderer,
          series: this,
          scaledValues: dimension,
          key: index
        })
      })

    if (this.axes.length === 1) throw new Error(ErrorMessages.parcoordMinAxesCount)

    this.categories = args.categories

    const denominator = this.axes.length > 1 ? this.axes.length - 1 : 1
    this.axesPercentageScale = ('class' in args) ? args.axesPercentageScale : scaleOrdinal<string, number>()
      .domain(this.axes.map((axis) => axis.key.getRawKey()))
      .range(this.axes.map((axis, index) => index / denominator))

    this.percentageScreenScale = ('class' in args) ? args.percentageScreenScale : scaleLinear().domain([0, 1])

    this.axesScale = scalePoint().domain(this.axes.map((axis) => axis.key.getRawKey()))
    
    this.zooms = args.zooms

    this.responsiveState = 'class' in args ? args.responsiveState.clone({series: this}) :
      new ParcoordResponsiveState({
      series: this,
      originalSeries: this.originalSeries,
      flipped: ('flipped' in args) ? args.flipped : false
    })

    this.axesInverted = 'class' in args ? args.axesInverted : this.axes.map(() => false)
  }

  getAxesDragDropOrdered() {
    return [...this.axes].sort((axis1, axis2) => {
      return this.axesPercentageScale(axis1.key.getRawKey()) < this.axesPercentageScale(axis2.key.getRawKey()) ? -1 : 1
    })
  }

  getScaledValuesAtScreenPosition(x: number, y: number) {
    const activeSeries = this.cloneFiltered()
    const chartS = activeSeries.axes[0].renderer.chartS
    const flipped = this.responsiveState.currentlyFlipped
    const axisPosition = flipped ? y : x
    const dimensionPosition = flipped ? x : y
    function axisDiff(axis: KeyedAxis) {
      const currentAxisPosition = activeSeries.axesScale(axis.key.getRawKey())!
      return Math.abs(currentAxisPosition - axisPosition)
    }
    const { axis } = activeSeries.axes.reduce((prev, current) => {
      const currentDiff = axisDiff(current)
      return currentDiff < prev.diff ? {
        axis: current, diff: currentDiff
      } : prev
    }, { axis: activeSeries.axes[0], diff: axisDiff(activeSeries.axes[0]) })

    const scaleFormat = axis.scaledValues.tag !== 'categorical' ? axis.scaledValues.scale.tickFormat() : (val => val)
    const format = axis.d3Axis?.tickFormat() ?? scaleFormat
    const axisName = getCurrentResponsiveValue(axis.title, {chart: chartS})
    const dimensionValue = format(axis.scaledValues.atScreenPosition(dimensionPosition), 0)
    return {
      horizontal: flipped ? dimensionValue : axisName,
      vertical: flipped ? axisName : dimensionValue,
      horizontalName: flipped ? axisName : 'Dimension',
      verticalName: flipped ? 'Dimension' : axisName
    }
  }

  renderTool(toolbarS: Selection<HTMLDivElement>) {
    renderTool(toolbarS, this)
  }

  cloneFiltered() {
    const activeIndices = !this.key.active ? [] :
      this.axes.map((_, index) => index).filter(index => this.axes[index].key.active)

    const activeAxes = activeIndices.map(index => this.axes[index])
    activeAxes.forEach(axis => axis.scaledValues = axis.scaledValues.cloneFiltered())

    const activeDomain = activeAxes.map(axis => axis.key.getRawKey())
    const activeRange = activeAxes.map(axis => this.axesPercentageScale(axis.key.getRawKey()))

    const clone = this.clone()
    clone.axes = activeAxes
    clone.axesScale.domain(activeDomain)
    clone.axesScale.range(this.axesScale.range())
    clone.axesPercentageScale
      .domain(activeDomain)
      .range(activeRange)
    clone.zooms = activeIndices.map(index => this.zooms[index])
    clone.axesInverted = activeIndices.map(index => this.axesInverted[index])
    if (clone.axes.length === 1) throw new Error(ErrorMessages.parcoordMinAxesCount)
    return clone
  }

  cloneZoomed() {
    const zoomDirection = this.responsiveState.currentlyFlipped ? 'x' : 'y'
    const zoomedAxes = this.axes.map((axis, index) => {
      const zoom = this.zooms[index]
      if (!zoom) return axis
      return {...axis, scaledValues: axis.scaledValues.cloneZoomed(zoom.currentTransform, zoomDirection)}
    })
    const clone = this.clone()
    clone.axes = zoomedAxes
    return clone
  }

  cloneInverted() {
    const invertedAxes = this.axes.map((axis, index) => {
      if (!this.axesInverted[index]) return axis
      return {...axis, scaledValues: axis.scaledValues.cloneRangeInversed()}
    })
    const clone = this.clone()
    clone.axes = invertedAxes
    return clone
  }

  clone(): ParcoordSeries {
    return new ParcoordSeries({
      ...this,
      axes: this.axes.map(axis => {
        return {...axis, scaledValues: axis.scaledValues.clone()}
      }),
      axesScale: this.axesScale.copy(),
      axesPercentageScale: this.axesPercentageScale.copy(),
      percentageScreenScale: this.percentageScreenScale.copy(),
    });
  }
}



type ParcoordResponsiveStateArgs = ResponsiveStateArgs & {
  series: ParcoordSeries
  originalSeries: ParcoordSeries
}

export class ParcoordResponsiveState extends ResponsiveState {
  protected _series: ParcoordSeries
  protected _originalSeries: ParcoordSeries
  protected _axisLayout: AxisLayout

  constructor(args: ParcoordResponsiveStateArgs) {
    super(args);
    this._series = args.series
    this._originalSeries = args.originalSeries
    this._axisLayout = this.currentlyFlipped ? 'bottom' : 'left'
  }

  get axisLayout() { return this._axisLayout }

  getAxisPosition(axisIndex: number) {
    const axis = this._series.axes[axisIndex]
    const percentage = this._series.axesPercentageScale(axis.key.getRawKey()) ?? 0
    return this.currentlyFlipped ? { x: 0, y: this._series.percentageScreenScale(percentage)} :
      { x: this._series.percentageScreenScale(percentage), y: 0 }
  }

  update() {
    super.update();
    const {horizontal, vertical} = this.drawAreaRange()
    const currentAxesSpaceRange = this.currentlyFlipped ? vertical : horizontal

    this._axisLayout = this.currentlyFlipped ? 'bottom' : 'left'
    const orientation = this.currentlyFlipped ? 'horizontal' : 'vertical'

    const {axes, axesScale, percentageScreenScale} = this._originalSeries
    axes.forEach(axis => axis.scaledValues.updateRange(horizontal, vertical, orientation))
    percentageScreenScale.range(currentAxesSpaceRange)
    axesScale.range(currentAxesSpaceRange)
  }

  cloneProps(): ParcoordResponsiveStateArgs {
    return { ...super.cloneProps(), series: this._series, originalSeries: this._originalSeries }
  }

  clone(args?: Partial<ParcoordResponsiveStateArgs>) {
    return new ParcoordResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
