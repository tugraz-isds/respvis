import {
  BaseAxisUserArgs,
  combineKeys,
  DataSeriesArgs,
  DataSeriesData,
  DataSeriesUserArgs,
  ErrorMessages,
  RVArray,
  ScaledValuesCategorical,
  ScaledValuesSpatialDomain,
  ScaledValuesSpatialUserArgs,
  SeriesKey,
  Size,
  validateDataSeriesArgs,
  validateScaledValuesSpatial,
  validateZoom,
  Zoom,
  ZoomArgs
} from "respvis-core";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import {Line} from "respvis-line";
import {KeyedAxis, validateKeyedAxis} from "../validate-keyed-axis";
import {scaleLinear, ScaleLinear, scaleOrdinal, ScaleOrdinal, scalePoint, ScalePoint} from "d3";
import {ParcoordSeries} from "./parcoord-series";

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
export type ParcoordSeriesData = DataSeriesData & {
  axes: KeyedAxis[]
  axesScale: ScalePoint<string>
  axesPercentageScale: ScaleOrdinal<string, number>
  percentageScreenScale: ScaleLinear<number, number>
  zooms: (Zoom | undefined)[]
  axesInverted: boolean[]
  //TODO: implement usage and initialization of markerTooltipGenerator for parcoords
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGPathElement, Line>
}

export function validateParcoordSeriesArgs(args: ParcoordSeriesArgs, series: ParcoordSeries): ParcoordSeriesData {
  const axes = args.dimensions.map((dimension, index) => { //TODO: data aligning
    return validateKeyedAxis({
      ...dimension.axis,
      renderer: args.renderer,
      series,
      scaledValues: validateScaledValuesSpatial(dimension.scaledValues, `a-${index}`),
      key: `a-${index}`
    })
  })
  if (axes.length === 1) throw new Error(ErrorMessages.parcoordMinAxesCount)

  let categories: ScaledValuesCategorical | undefined = undefined
  if (args.categories) {
    const alignedCategories = {
      ...args.categories, //TODO: index check
      values: RVArray.equalizeLengths(args.categories.values, axes[0].scaledValues.values)[0]
    }
    categories = new ScaledValuesCategorical({...alignedCategories, parentKey: 's-0'})
  }

  if (categories && categories.values.length !== axes[0].scaledValues.values.length) {
    throw new Error(ErrorMessages.categoricalValuesMismatch)
  }

  const denominator = axes.length > 1 ? axes.length - 1 : 1

  const data = {
    ...validateDataSeriesArgs(args, series),
    axes,
    axesScale: scalePoint().domain(axes.map((axis) => axis.key)),
    axesPercentageScale: scaleOrdinal<string, number>()
      .domain(axes.map((axis) => axis.key)).range(axes.map((axis, index) => index / denominator)),
    percentageScreenScale: scaleLinear().domain([0, 1]),
    zooms: args.dimensions.map(dimension => {
      return dimension.zoom ? validateZoom(dimension.zoom) : undefined
    }),
    axesInverted: axes.map(() => false),
    getCombinedKey(this: ParcoordSeriesData, i: number) {
      const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
      return combineKeys([this.key, this.axes[i].key, seriesCategoryKey])
    }
  }

  if (data.color && data.color.values.length !== axes[0].scaledValues.values.length) {
    throw new Error(ErrorMessages.sequentialColorValuesMismatch)
  }

  return data
}

export function cloneParcoordData(original: ParcoordSeriesData): ParcoordSeriesData {
  return {
    ...original,
    axes: original.axes.map(axis => {
      return {...axis, scaledValues: axis.scaledValues.clone()}
    }),
    axesScale: original.axesScale.copy(),
    axesPercentageScale: original.axesPercentageScale.copy(),
    percentageScreenScale: original.percentageScreenScale.copy(),
  }
}
