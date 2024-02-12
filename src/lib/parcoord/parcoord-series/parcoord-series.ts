import {Series, SeriesArgs, SeriesUserArgs} from "../../core/render/series";
import {SeriesKey} from "../../core/constants/types";
import {arrayAlignLengths, AxisBaseUserArgs, AxisDomainRV, axisScaledValuesValidation, Size} from "../../core";
import {ScaledValuesUserArgs} from "../../core/data/scale/scaled-values";
import {scalePoint, ScalePoint} from "d3";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {combineKeys} from "../../core/utilities/dom/key";
import {KeyedAxisValid, keyedAxisValidation} from "../../core/render/axis/keyed-axis-validation";
import {ZoomArgs, ZoomValid, zoomValidation} from "../../core/data/zoom";

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
  zooms: (ZoomValid | undefined)[]

  constructor(args: ParcoordArgs | ParcoordSeries) {
    super(args)
    const {renderer} = args

    //TODO: data aligning
    this.axes = 'class' in args ? args.axes :
      args.dimensions.map((dimension, index) => {
        return keyedAxisValidation({
          ...dimension.axis, renderer,
          scaledValues: axisScaledValuesValidation(dimension.scaledValues, `a-${index}`),
          key: `a-${index}`
        })
      })

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

    this.axesScale = scalePoint()
      .domain(this.axes.map((axis) => axis.key))

    this.axes.forEach((axis) => {
      this.keysActive[axis.key] = true
    })
    
    this.zooms = 'class' in args ? args.zooms : args.dimensions.map(dimension => {
      return dimension.zoom ? zoomValidation(dimension.zoom) : undefined
    })
  }

  getCombinedKey(i: number): string {
    const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
    return combineKeys([this.key, this.axes[i].key, seriesCategoryKey])
  }

  clone(): ParcoordSeries {
    return new ParcoordSeries({
      ...this,
      axes: this.axes.map(axis => {
        return {...axis, scaledValues: axis.scaledValues.clone()}
      }),
      axesScale: this.axesScale.copy(),
    });
  }
}
