import {
  AxisLayout,
  BaseAxisUserArgs,
  combineKeys,
  ErrorMessages,
  getCurrentResponsiveValue,
  ResponsiveState,
  ResponsiveStateArgs,
  RVArray,
  ScaledValuesCategorical,
  ScaledValuesSpatialDomain,
  ScaledValuesSpatialUserArgs,
  Series,
  SeriesArgs,
  SeriesKey,
  SeriesUserArgs,
  Size,
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

export type ParcoordArgs = SeriesArgs & ParcoordSeriesUserArgs & {
  originalSeries?: ParcoordSeries
  key: SeriesKey
  bounds?: Size,
}

export class ParcoordSeries extends Series {
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

    //TODO: data aligning
    this.axes = 'class' in args ? args.axes :
      args.dimensions.map((dimension, index) => {
        return validateKeyedAxis({
          ...dimension.axis, renderer,
          series: this,
          scaledValues: validateScaledValuesSpatial(dimension.scaledValues, `a-${index}`),
          key: `a-${index}`
        })
      })

    if (this.axes.length === 1) throw new Error(ErrorMessages.parcoordMinAxesCount)

    if ('class' in args) this.categories = args.categories
    else {
      //TODO: index check
      const alignedCategories = args.categories ? {
        ...args.categories,
        values: RVArray.equalizeLengths(args.categories.values, this.axes[0].scaledValues.values)[0]
      } : undefined
      this.categories = alignedCategories ? new ScaledValuesCategorical({...alignedCategories, parentKey: 's-0'}) :
        undefined
    }

    const denominator = this.axes.length > 1 ? this.axes.length - 1 : 1
    this.axesPercentageScale = ('class' in args) ? args.axesPercentageScale : scaleOrdinal<string, number>()
      .domain(this.axes.map((axis) => axis.key))
      .range(this.axes.map((axis, index) => index / denominator))

    this.percentageScreenScale = ('class' in args) ? args.percentageScreenScale : scaleLinear().domain([0, 1])

    this.axesScale = scalePoint()
      .domain(this.axes.map((axis) => axis.key))
    
    this.zooms = 'class' in args ? args.zooms : args.dimensions.map(dimension => {
      return dimension.zoom ? validateZoom(dimension.zoom) : undefined
    })

    this.responsiveState = 'class' in args ? args.responsiveState.clone({series: this}) :
      new ParcoordResponsiveState({
      series: this,
      originalSeries: this.originalSeries,
      flipped: ('flipped' in args) ? args.flipped : false
    })

    this.axesInverted = 'class' in args ? args.axesInverted : this.axes.map(() => false)

    if (this.categories && this.categories.values.length !== this.axes[0].scaledValues.values.length) {
      throw new Error(ErrorMessages.categoricalValuesMismatch)
    }

    if (this.color && this.color.values.length !== this.axes[0].scaledValues.values.length) {
      throw new Error(ErrorMessages.sequentialColorValuesMismatch)
    }
  }

  getCombinedKey(i: number): string {
    const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
    return combineKeys([this.key, this.axes[i].key, seriesCategoryKey])
  }

  getAxesDragDropOrdered() {
    return [...this.axes].sort((axis1, axis2) => {
      return this.axesPercentageScale(axis1.key) < this.axesPercentageScale(axis2.key) ? -1 : 1
    })
  }

  getScaledValuesAtScreenPosition(x: number, y: number) {
    const activeSeries = this.cloneFiltered()
    const chartS = activeSeries.axes[0].renderer.chartS
    const flipped = this.responsiveState.currentlyFlipped
    const axisPosition = flipped ? y : x
    const dimensionPosition = flipped ? x : y
    function axisDiff(axis: KeyedAxis) {
      const currentAxisPosition = activeSeries.axesScale(axis.key)!
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
    const activeIndices = !this.keysActive[this.key] ? [] :
      this.axes.map((_, index) => index)
        .filter(index => this.axes[index].isKeyActiveByKey(this.axes[index].key))

    const activeAxes = activeIndices.map(index => this.axes[index])
    activeAxes.forEach(axis => axis.scaledValues = axis.scaledValues.cloneFiltered())

    const activeDomain = activeAxes.map(axis => axis.key)
    const activeRange = activeAxes.map(axis => this.axesPercentageScale(axis.key))

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
    const percentage = this._series.axesPercentageScale(axis.key) ?? 0
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
