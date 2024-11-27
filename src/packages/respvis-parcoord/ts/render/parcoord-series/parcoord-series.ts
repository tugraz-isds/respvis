import {DataSeries, ErrorMessages, getCurrentResponsiveValue, Renderer} from "respvis-core";
import {Selection} from "d3";
import {renderTool} from "./render/render-tool";
import {KeyedAxis} from "../validate-keyed-axis";
import {
  cloneParcoordData,
  ParcoordSeriesArgs,
  ParcoordSeriesData,
  validateParcoordSeriesArgs
} from "./validate-parcoord-series";
import {ParcoordResponsiveState} from "./parcoord-responsive-state";

export class ParcoordSeries implements DataSeries {
  originalData: ParcoordSeriesData
  renderData: ParcoordSeriesData
  renderer: Renderer
  responsiveState: ParcoordResponsiveState

  constructor(args: ParcoordSeriesArgs) {
    this.renderer = args.renderer
    this.originalData = validateParcoordSeriesArgs(args, this)
    this.renderData = this.originalData
    this.responsiveState = new ParcoordResponsiveState({
      series: this,
      flipped: args.flipped,
    })
  }

  getAxesDragDropOrdered() { //TODO: to data object!
    const {axes,  axesPercentageScale} = this.renderData
    return [...axes].sort((axis1, axis2) => {
      return axesPercentageScale(axis1.key) < axesPercentageScale(axis2.key) ? -1 : 1
    })
  }

  getScaledValuesAtScreenPosition(x: number, y: number) {
    const activeSeries = this.applyFilter()
    const {axes, axesPercentageScale, percentageScreenScale} = activeSeries.renderData
    const chartS = axes[0].renderer.chartS
    const flipped = this.responsiveState.currentlyFlipped
    const axisPosition = flipped ? y : x
    const dimensionPosition = flipped ? x : y

    function axisDiff(axis: KeyedAxis) {
      const currentAxisPosition = percentageScreenScale(axesPercentageScale(axis.key))
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
    const dimensionValue = axis.scaledValues.atScreenPosition(dimensionPosition)
    const dimensionValueFormatted = format(dimensionValue, 0)
    return {
      horizontal: flipped ? dimensionValueFormatted : axisName,
      horizontalName: flipped ? axisName : 'Dimension',
      horizontalNearestRealValue: flipped ? axis.scaledValues.getNearestValue(dimensionValue as never) : axisName,
      horizontalScreenValue: flipped ? dimensionValue : axisName,
      vertical: flipped ? axisName : dimensionValueFormatted,
      verticalName: flipped ? 'Dimension' : axisName,
      verticalNearestRealValue: flipped ? axisName : axis.scaledValues.getNearestValue(dimensionValue as never),
      verticalScreenValue: flipped ? axisName : dimensionValue,
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
    const {axes, axesPercentageScale,
      zooms, axesInverted, keysActive, key} = this.renderData

    const activeIndices = !keysActive[key] ? [] : axes.map((_, index) => index)
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
