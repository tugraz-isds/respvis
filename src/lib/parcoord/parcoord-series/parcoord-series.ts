import {Series, SeriesArgs, SeriesUserArgs} from "../../core/render/series";
import {AxisKey, SeriesKey} from "../../core/constants/types";
import {
  arrayAlignLengths,
  AxisDomainRV,
  axisScaledValuesValidation,
  AxisUserArgs,
  AxisValid,
  axisValidation,
  Size
} from "../../core";
import {ScaledValuesUserArgs} from "../../core/data/scale/scaled-values";
import {scalePoint, ScalePoint} from "d3";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {combineKeys, mergeKeys} from "../../core/utilities/dom/key";

export type ParcoordSeriesUserArgs = SeriesUserArgs & {
  dimensions: {
    scaledValues: ScaledValuesUserArgs<AxisDomainRV>
    axis: AxisUserArgs
  }[]
}

export type ParcoordArgs = SeriesArgs & ParcoordSeriesUserArgs & {
  key: SeriesKey
  bounds?: Size,
}

export class ParcoordSeries extends Series {
  axes: AxisValid[]
  axesScale: ScalePoint<string>
  axisKeys: AxisKey[]

  constructor(args: ParcoordArgs | ParcoordSeries) {
    super(args)
    const {renderer} = args

    //TODO: data aligning
    this.axes = args instanceof ParcoordSeries ? args.axes : args.dimensions.map((dimension, index) => {
      return axisValidation({
        ...dimension.axis, renderer,
        scaledValues: axisScaledValuesValidation(dimension.scaledValues, `a-${index}`)
      })
    })

    if (args instanceof ParcoordSeries) this.categories = args.categories
    else {
      //TODO: index check
      const alignedCategories = args.categories ? {...args.categories,
        values: arrayAlignLengths(args.categories.values, this.axes[0].scaledValues.values)[0]
      } : undefined
      this.categories = alignedCategories ? new ScaledValuesCategorical({...alignedCategories, parentKey: 's-0'}) :
        undefined
    }

    this.axesScale = scalePoint()
      .domain(this.axes.map((_, index) => `a-${index}`))

    const instance = this
    this.axisKeys = this.axes.map((axis, index) => `a-${index}` as const)
    this.axisKeys.forEach((key) => {
      instance.keysActive[mergeKeys([instance.key, key])] = true
    })
  }

  getCombinedKey(i: number): string {
    const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
    return combineKeys([this.key, this.axisKeys[i], seriesCategoryKey])
  }
  clone(): ParcoordSeries {
    return new ParcoordSeries(this);
  }
}
