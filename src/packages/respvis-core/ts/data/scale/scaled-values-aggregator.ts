import {sum} from "../../utilities/array";
import {ScaleLinear, scaleLinear} from "d3";
import {ScaledValuesNumeric} from "./scaled-values-spatial/scaled-values-numeric";
import {ScaledValuesCategorical} from "./scaled-values-spatial/scaled-values-categorical";

export class ScaledValuesAggregator {
  numericalValues: ScaledValuesNumeric
  categoricalValues: ScaledValuesCategorical
  additionalCategories: ScaledValuesCategorical
  aggregatedScale?: ScaleLinear<number, number, never>
  private aggregationResult?: ScaledValuesNumeric
  constructor(linearValues: ScaledValuesNumeric,
              categoricalValues: ScaledValuesCategorical,
              additionalCategories: ScaledValuesCategorical,
              aggregatedScale?: ScaleLinear<number, number, never>) {
    this.numericalValues = linearValues
    this.categoricalValues = categoricalValues
    this.additionalCategories = additionalCategories
    this.aggregatedScale = aggregatedScale
  }

  aggregateCached(): ScaledValuesNumeric {
    if (this.aggregationResult) return this.aggregationResult
    const numberCategories = this.categoricalValues.categories.categoryOrder.length
    const numberValues = this.categoricalValues.categories.values.length
    const groupedValues: number[][] = new Array<null>(numberCategories).fill(null).map(() => [])
    const summedValues: number[] = new Array<number>(numberCategories).fill(0)
    const cumulativeValues: number[] = new Array<number>(numberValues).fill(0)

    const orderMap = this.categoricalValues.categories.categoryOrderMap
    this.categoricalValues.values.forEach((category, i) => {
      const categoryOrder = orderMap[category]
      const currentValue = this.numericalValues.values[i]
      groupedValues[categoryOrder].push(currentValue)
      if (this.additionalCategories && !this.additionalCategories.isValueActive(i)) return
      cumulativeValues[i] = summedValues[categoryOrder]
      summedValues[categoryOrder] += this.numericalValues.values[i]
    }, [])

    const aggregatedValuesOrder = groupedValues.map(vals => sum(vals))
    console.assert(aggregatedValuesOrder.length === this.categoricalValues.categories.categoryOrder.length)
    const aggregatedDomain = [this.numericalValues.scale.domain()[0], Math.max(...aggregatedValuesOrder)]

    this.aggregationResult = new ScaledValuesNumeric({
      values: cumulativeValues,
      scale: this.aggregatedScale ? this.aggregatedScale : scaleLinear().domain(aggregatedDomain).nice(),
      parentKey: this.numericalValues.parentKey
    })
    return this.aggregationResult
  }
}
