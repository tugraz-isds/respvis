import {
  AxisLayout,
  BaseAxisUserArgs,
  combineKeys,
  DataSeries,
  DataSeriesArgs,
  DataSeriesUserArgs,
  ErrorMessages,
  getCurrentResponsiveValue,
  ResponsiveState,
  ResponsiveStateArgs,
  RVArray,
  ScaledValuesCategorical,
  ScaledValuesSpatialDomain,
  ScaledValuesSpatialUserArgs,
  SeriesKey,
  Size,
  validateScaledValuesSpatial,
  validateZoom,
  Zoom,
  ZoomArgs
} from "respvis-core";
import {
  scaleLinear,
  ScaleLinear,
  scaleOrdinal,
  ScaleOrdinal,
  scalePoint,
  ScalePoint,
  Selection,
  ZoomTransform
} from "d3";
import {renderTool} from "./render/render-tool";
import {KeyedAxis, validateKeyedAxis} from "../validate-keyed-axis";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import {Line} from "respvis-line";

export type ParcoordSeriesUserArgs = DataSeriesUserArgs & {
  dimensions: {
    scaledValues: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>
    axis: BaseAxisUserArgs
    zoom?: ZoomArgs
  }[],
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGRectElement, Line>
}

export type ParcoordSeriesArgs = DataSeriesArgs & ParcoordSeriesUserArgs & {
  original?: ParcoordSeries
  key: SeriesKey
  bounds?: Size,
}

export type ParcoordData = {
  axes: KeyedAxis[]
  axesScale: ScalePoint<string>
  axesPercentageScale: ScaleOrdinal<string, number>
  percentageScreenScale: ScaleLinear<number, number>
  zooms: (Zoom | undefined)[]
  axesInverted: boolean[]
  //TODO: implement usage and initialization of markerTooltipGenerator for parcoords
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGPathElement, Line>
}

function validateParcoordSeriesArgs(args: ParcoordSeriesArgs): ParcoordData {
  const axes = args.dimensions.map((dimension, index) => { //TODO: data aligning
    return validateKeyedAxis({...dimension.axis,
      renderer: args.renderer,
      series: this,
      scaledValues: validateScaledValuesSpatial(dimension.scaledValues, `a-${index}`),
      key: `a-${index}`
    })
  })
  if (axes.length === 1) throw new Error(ErrorMessages.parcoordMinAxesCount)

  let categories: ScaledValuesCategorical | undefined = undefined
  if (args.categories) {
    const alignedCategories = { ...args.categories, //TODO: index check
      values: RVArray.equalizeLengths(args.categories.values, this.axes[0].scaledValues.values)[0]
    }
    categories = new ScaledValuesCategorical({...alignedCategories, parentKey: 's-0'})
  }

  if (categories && categories.values.length !== axes[0].scaledValues.values.length) {
    throw new Error(ErrorMessages.categoricalValuesMismatch)
  }

  const denominator = this.axes.length > 1 ? this.axes.length - 1 : 1

  if (this.color && this.color.values.length !== this.axes[0].scaledValues.values.length) {
    throw new Error(ErrorMessages.sequentialColorValuesMismatch)
  }

  return {
    axes,
    axesScale: scalePoint().domain(this.axes.map((axis) => axis.key)),
    axesPercentageScale:  scaleOrdinal<string, number>()
      .domain(this.axes.map((axis) => axis.key)).range(this.axes.map((axis, index) => index / denominator)),
    percentageScreenScale: scaleLinear().domain([0, 1]),
    zooms: args.dimensions.map(dimension => {
      return dimension.zoom ? validateZoom(dimension.zoom) : undefined
    }),
    axesInverted: this.axes.map(() => false)
  }
}

function cloneParcoordData(original: ParcoordData): ParcoordData {
  return {...original,
    axes: original.axes.map(axis => {
      return {...axis, scaledValues: axis.scaledValues.clone()}
    }),
    axesScale: original.axesScale.copy(),
    axesPercentageScale: original.axesPercentageScale.copy(),
    percentageScreenScale: original.percentageScreenScale.copy(),
  }
}

export class ParcoordSeries extends DataSeries {
  originalData: ParcoordData
  renderData: ParcoordData
  responsiveState: ParcoordResponsiveState
  providesTool = true

  constructor(args: ParcoordSeriesArgs) {
    super(args)
    this.originalData = validateParcoordSeriesArgs(args)
    this.renderData = this.originalData

    this.responsiveState = new ParcoordResponsiveState({
      series: this,
      flipped: args.flipped,
      originalSeries: this
    })
  }

  getCombinedKey(i: number): string { //TODO: to data object?
    const {axes} = this.renderData
    const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
    return combineKeys([this.key, axes[i].key, seriesCategoryKey])
  }

  getAxesDragDropOrdered() { //TODO: to data object?
    const {axes,  axesPercentageScale} = this.renderData
    return [...axes].sort((axis1, axis2) => {
      return axesPercentageScale(axis1.key) < axesPercentageScale(axis2.key) ? -1 : 1
    })
  }

  getScaledValuesAtScreenPosition(x: number, y: number) {
    const activeSeries = this.applyFilter()
    const {axes, axesScale} = activeSeries.renderData
    const chartS = axes[0].renderer.chartS
    const flipped = this.responsiveState.currentlyFlipped
    const axisPosition = flipped ? y : x
    const dimensionPosition = flipped ? x : y

    function axisDiff(axis: KeyedAxis) {
      const currentAxisPosition = axesScale(axis.key)!
      return Math.abs(currentAxisPosition - axisPosition)
    }

    const {axis} = axes.reduce((prev, current) => {
      const currentDiff = axisDiff(current)
      return currentDiff < prev.diff ? {
        axis: current, diff: currentDiff
      } : prev
    }, {axis: axes[0], diff: axisDiff(axes[0])})

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

  cloneToRenderData() {
    this.renderData = cloneParcoordData(this.originalData)
    return this
  }

  applyFilter(): ParcoordSeries {
    const {axes, axesPercentageScale, zooms, axesInverted} = this.renderData
    const activeIndices = !this.keysActive[this.key] ? [] :
      axes.map((_, index) => index)
        .filter(index => axes[index].isKeyActiveByKey(axes[index].key))

    const activeAxes = activeIndices.map(index => axes[index])
    activeAxes.forEach(axis => axis.scaledValues = axis.scaledValues.cloneFiltered())

    const activeDomain = activeAxes.map(axis => axis.key)
    const activeRange = activeAxes.map(axis => axesPercentageScale(axis.key))

    this.renderData = {...this.renderData,
      axes: activeAxes,
      zooms: activeIndices.map(index => zooms[index]),
      axesInverted: activeIndices.map(index => axesInverted[index])
    }

    this.renderData.axesScale.domain(activeDomain)
    this.renderData.axesScale.range(this.renderData.axesScale.range())
    this.renderData.axesPercentageScale
      .domain(activeDomain)
      .range(activeRange)

    if (this.renderData.axes.length === 1) throw new Error(ErrorMessages.parcoordMinAxesCount)
    return this
  }

  applyZoom(): ParcoordSeries {
    const {axes, zooms} = this.renderData
    const zoomDirection = this.responsiveState.currentlyFlipped ? 'x' : 'y'
    this.renderData.axes = axes.map((axis, index) => {
      const zoom = zooms[index]
      if (!zoom) return axis
      return {...axis, scaledValues: axis.scaledValues.cloneZoomed(zoom.currentTransform, zoomDirection)}
    })
    return this
  }

  applyInversion(): ParcoordSeries {
    const {axes, axesInverted} = this.renderData
    this.renderData.axes = axes.map((axis, index) => {
      if (!axesInverted[index]) return axis
      return {...axis, scaledValues: axis.scaledValues.cloneRangeInversed()}
    })
    return this
  }
}


type ParcoordResponsiveStateArgs = ResponsiveStateArgs & {
  series: ParcoordSeries
}

export class ParcoordResponsiveState extends ResponsiveState {
  protected _series: ParcoordSeries
  protected _axisLayout: AxisLayout

  constructor(args: ParcoordResponsiveStateArgs) {
    super(args);
    this._series = args.series
    this._axisLayout = this.currentlyFlipped ? 'bottom' : 'left'
  }

  get axisLayout() {
    return this._axisLayout
  }

  getAxisPosition(key: string) {
    const {axesPercentageScale, percentageScreenScale} = this._series.renderData
    const percentage = axesPercentageScale(key) ?? 0
    return this.currentlyFlipped ? {x: 0, y: percentageScreenScale(percentage)} : {x: percentageScreenScale(percentage), y: 0}
  }

  update() {
    this.updateZoomOnFlip()
    super.update()
    this.updateScales()
  }

  private updateScales() {
    const {horizontal, vertical} = this.drawAreaRange()
    const currentAxesSpaceRange = this.currentlyFlipped ? vertical : horizontal

    this._axisLayout = this.currentlyFlipped ? 'bottom' : 'left'
    const orientation = this.currentlyFlipped ? 'horizontal' : 'vertical'

    const {axes, axesScale, percentageScreenScale} = this._series.originalData
    axes.forEach(axis => axis.scaledValues.updateRange(horizontal, vertical, orientation))
    percentageScreenScale.range(currentAxesSpaceRange)
    axesScale.range(currentAxesSpaceRange)
  }

  private updateZoomOnFlip() {
    if (this._previouslyFlipped === this._currentlyFlipped) return

    this._series.originalData.zooms.forEach((zoom, i) => {
      if (!zoom?.currentTransform || zoom.currentTransform.k === 1) return
      // const t = zoom.currentTransform
      // reset zoom on flipping. TODO: Desired would be a rescaling from x to y and vice versa
      zoom.currentTransform = new ZoomTransform(1, 0, 0)
    })
  }

  cloneProps(): ParcoordResponsiveStateArgs {
    return {...super.cloneProps(), series: this._series, originalSeries: this._originalSeries}
  }

  clone(args?: Partial<ParcoordResponsiveStateArgs>) {
    return new ParcoordResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
