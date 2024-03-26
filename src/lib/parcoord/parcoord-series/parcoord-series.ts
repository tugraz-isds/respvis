import {Series, SeriesArgs, SeriesUserArgs} from "../../core/render/series";
import {SeriesKey} from "../../core/constants/types";
import {arrayAlignLengths, AxisBaseUserArgs, AxisDomainRV, axisScaledValuesValidation, Size} from "../../core";
import {ScaledValuesUserArgs} from "../../core/data/scale/scaled-values";
import {scaleLinear, ScaleLinear, scaleOrdinal, ScaleOrdinal, scalePoint, ScalePoint} from "d3";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {combineKeys} from "../../core/utilities/dom/key";
import {KeyedAxisValid, keyedAxisValidation} from "../../core/render/axis/keyed-axis-validation";
import {ZoomArgs, ZoomValid, zoomValidation} from "../../core/data/zoom";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";
import {ErrorMessages} from "../../core/utilities/error";

export type ParcoordSeriesUserArgs = SeriesUserArgs & {
  dimensions: {
    scaledValues: ScaledValuesUserArgs<AxisDomainRV>
    axis: AxisBaseUserArgs
    zoom?: ZoomArgs
  }[]
}

export type ParcoordArgs = SeriesArgs & ParcoordSeriesUserArgs & {
  key: SeriesKey
  bounds?: Size,
}

export class ParcoordSeries extends Series {
  axes: KeyedAxisValid[]
  axesScale: ScalePoint<string>
  axesPercentageScale: ScaleOrdinal<string, number>
  percentageScreenScale: ScaleLinear<number, number>
  zooms: (ZoomValid | undefined)[]

  constructor(args: ParcoordArgs | ParcoordSeries) {
    super(args)
    const {renderer} = args

    //TODO: data aligning
    this.axes = 'class' in args ? args.axes :
      args.dimensions.map((dimension, index) => {
        return keyedAxisValidation({
          ...dimension.axis, renderer,
          series: this,
          scaledValues: axisScaledValuesValidation(dimension.scaledValues, `a-${index}`),
          key: `a-${index}`
        })
      })

    if (this.axes.length < 2) throw new Error(ErrorMessages.parcoordMinAxesCount)

    if ('class' in args) this.categories = args.categories
    else {
      //TODO: index check
      const alignedCategories = args.categories ? {
        ...args.categories,
        values: arrayAlignLengths(args.categories.values, this.axes[0].scaledValues.values)[0]
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
      return dimension.zoom ? zoomValidation(dimension.zoom) : undefined
    })
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
    const chartE = elementFromSelection(activeSeries.axes[0].renderer.chartSelection)
    function axisDiff(axis: KeyedAxisValid) {
      const currentAxisPosition = activeSeries.axesScale(axis.key)!
      return Math.abs(currentAxisPosition - x)
    }
    const { axis } = activeSeries.axes.reduce((prev, current) => {
      const currentDiff = axisDiff(current)
      return currentDiff < prev.diff ? {
        axis: current, diff: currentDiff
      } : prev
    }, { axis: activeSeries.axes[0], diff: axisDiff(activeSeries.axes[0]) })

    return {
      x: getCurrentRespVal(axis.title, {chart: chartE}),
      y: axis.scaledValues.scaledValueAtScreenPosition(y)
    }
  }

  cloneFiltered() {
    const activeIndices = !this.keysActive[this.key] ? [] :
      this.axes
        .map((axis, index) => index)
        .filter(index => this.axes[index].isKeyActiveByKey(this.axes[index].key))
    const activeAxes = activeIndices.map(index => this.axes[index])
    const activeDomain = activeAxes.map(axis => axis.key)
    const activeRange = activeAxes.map(axis => this.axesPercentageScale(axis.key))
    const activeZooms = activeIndices.map(index => this.zooms[index])
    const clone = this.clone()
    clone.axes = activeAxes
    clone.axesScale.domain(activeDomain)
    clone.axesScale.range(this.axesScale.range())
    clone.axesPercentageScale
      .domain(activeDomain)
      .range(activeRange)
    clone.zooms = activeZooms
    if (clone.axes.length === 1) throw new Error(ErrorMessages.parcoordMinAxesCount)
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
