import {sum} from "../../utilities/array";
import {ScaleLinear, scaleLinear} from "d3";
import {ScaledValuesLinear} from "./scaled-values-linear";
import {ScaledValuesCategorical} from "./scaled-values-categorical";


export class ScaledValuesAggregation {
  linearValues: ScaledValuesLinear
  categoricalValues: ScaledValuesCategorical
  additionalCategories: ScaledValuesCategorical
  aggregatedScale?: ScaleLinear<number, number, never>
  private aggregationResult?: ScaledValuesLinear
  constructor(linearValues: ScaledValuesLinear,
              categoricalValues: ScaledValuesCategorical,
              additionalCategories: ScaledValuesCategorical,
              aggregatedScale?: ScaleLinear<number, number, never>) {
    this.linearValues = linearValues
    this.categoricalValues = categoricalValues
    this.additionalCategories = additionalCategories
    this.aggregatedScale = aggregatedScale
  }

  aggregateCached(): ScaledValuesLinear {
    if (this.aggregationResult) return this.aggregationResult
    const numberCategories = this.categoricalValues.categories.categoryOrder.length
    const numberValues = this.categoricalValues.categories.values.length
    const groupedValues: number[][] = new Array<null>(numberCategories).fill(null).map(() => [])
    const summedValues: number[] = new Array<number>(numberCategories).fill(0)
    const cumulativeValues: number[] = new Array<number>(numberValues).fill(0)

    const orderMap = this.categoricalValues.categories.categoryOrderMap
    this.categoricalValues.values.forEach((category, i) => {
      const categoryOrder = orderMap[category]
      const currentValue = this.linearValues.values[i]
      groupedValues[categoryOrder].push(currentValue)
      if (this.additionalCategories && !this.additionalCategories.isKeyActiveByIndex(i)) return
      cumulativeValues[i] = summedValues[categoryOrder]
      summedValues[categoryOrder] += this.linearValues.values[i]
    }, [])

    const aggregatedValuesOrder = groupedValues.map(vals => sum(vals))
    console.assert(aggregatedValuesOrder.length === this.categoricalValues.categories.categoryOrder.length)
    const aggregatedDomain = [this.linearValues.scale.domain()[0], Math.max(...aggregatedValuesOrder)]

    this.aggregationResult = new ScaledValuesLinear({
      values: cumulativeValues,
      scale: this.aggregatedScale ? this.aggregatedScale : scaleLinear().domain(aggregatedDomain).nice(),
      parentKey: this.linearValues.parentKey
    })
    return this.aggregationResult
  }
}
