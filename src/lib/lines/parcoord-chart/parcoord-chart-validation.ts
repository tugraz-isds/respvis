import {
  arrayAlignLengths,
  AxisDomainRV,
  axisScaledValuesValidation,
  AxisUserArgs,
  AxisValid,
  axisValidation,
  ChartBaseArgs,
  ChartBaseValid,
  chartBaseValidation
} from "../../core";
import {ScaledValuesCategorical} from "../../core/data/scale/scaled-values-categorical";
import {CategoryUserArgs} from "../../core/data/category";
import {ScaledValuesUserArgs} from "../../core/data/scale/scaled-values";

export type ParcoordChartUserArgs = Omit<ParcoordChartArgs, 'renderer'>

export type ParcoordChartArgs = ChartBaseArgs & {
  dimensions: {
    scaledValues: ScaledValuesUserArgs<AxisDomainRV>
    axis: AxisUserArgs
  }[]
  categories?: CategoryUserArgs
  // legend?: LegendUserArgs
  // zoom?: ZoomArgs
}

//TODO: create own parcoord series from arguments
export type ParcoordChartValid = ChartBaseValid & {
  axes: AxisValid[]
  categories?: ScaledValuesCategorical
  // legend: LegendValid
  // zoom?: ZoomValid
}


export function parcoordChartValidation(args: ParcoordChartArgs): ParcoordChartValid {
  const {dimensions} = args

  //TODO: data aligning
  const axes = dimensions.map((dimension, index) => {
    console.log(dimension, index)
    return axisValidation({
      ...args, ...dimension.axis,
      scaledValues: axisScaledValuesValidation(dimension.scaledValues, `a-${index}`)
    })
  })

  //TODO: index check
  const alignedCategories = args.categories ? {...args.categories,
    values: arrayAlignLengths(args.categories.values, axes[0].scaledValues.values)[0]
  } : undefined
  const categories = alignedCategories ?
    new ScaledValuesCategorical({...alignedCategories, parentKey: 's-0'}) :
    undefined

  return {
    ...chartBaseValidation(args),
    axes,
    categories
  }
}
