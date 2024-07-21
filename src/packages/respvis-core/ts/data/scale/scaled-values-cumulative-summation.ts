import {scaleLinear} from "d3";
import {ScaledValuesNumeric} from "./scaled-values-spatial/scaled-values-numeric";
import {ScaledValuesCategorical} from "./scaled-values-spatial/scaled-values-categorical";
import {RVArray} from "../../utilities";
import {ScaleNumeric} from "./scales";

export class ScaledValuesCumulativeSummation {
  numericalValues: ScaledValuesNumeric
  categoricalValues: ScaledValuesCategorical
  additionalCategories: ScaledValuesCategorical
  aggregatedScale?: ScaleNumeric
  private aggregationResult?: ScaledValuesNumeric
  constructor(linearValues: ScaledValuesNumeric,
              categoricalValues: ScaledValuesCategorical,
              additionalCategories: ScaledValuesCategorical,
              aggregatedScale?: ScaleNumeric) {
    this.numericalValues = linearValues
    this.categoricalValues = categoricalValues
    this.additionalCategories = additionalCategories
    this.aggregatedScale = aggregatedScale
  }

  sumCached(): ScaledValuesNumeric {
    if (this.aggregationResult) return this.aggregationResult
    const numberCategories = this.categoricalValues.categories.categoryArray.length
    const groupedValues: number[][] = new Array<null>(numberCategories).fill(null).map(() => [])
    const summedValues: number[] = new Array<number>(numberCategories).fill(0)
    const numberValues = this.categoricalValues.values.length
    const cumulativeValues: number[] = new Array<number>(numberValues).fill(0)

    this.categoricalValues.values.forEach((_, i) => {
      const categoryOrder = this.categoricalValues.getOrder(i)
      const currentValue = this.numericalValues.values[i]
      groupedValues[categoryOrder].push(currentValue)
      if (this.additionalCategories && !this.additionalCategories.isValueActive(i)) return
      cumulativeValues[i] = summedValues[categoryOrder]
      summedValues[categoryOrder] += this.numericalValues.values[i]
    }, [])

    const aggregatedValuesOrder = groupedValues.map(vals => RVArray.sum(vals))
    console.assert(aggregatedValuesOrder.length === this.categoricalValues.categories.categoryArray.length)
    const aggregatedDomain = [this.numericalValues.scale.domain()[0], Math.max(...aggregatedValuesOrder)]

    this.aggregationResult = new ScaledValuesNumeric({
      values: cumulativeValues,
      scale: this.aggregatedScale ? this.aggregatedScale : scaleLinear().domain(aggregatedDomain).nice(),
      parentKey: this.numericalValues.parentKey
    })
    return this.aggregationResult
  }
}
