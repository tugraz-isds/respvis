import {AxisDomainRV} from "./axis-scaled-values-validation";
import {sum} from "../../utilities/array";
import {scaleLinear} from "d3";
import {ScaledValuesBase} from "./scaled-values-base";
import {ScaledValuesLinear} from "./scaled-values-linear";
import {ScaledValuesCategorical} from "./scaled-values-categorical";


export class ScaledValuesAggregation {
  linearValues?: ScaledValuesLinear
  categoricalValues?: ScaledValuesCategorical
  additionalCategories?: ScaledValuesCategorical
  constructor(val1: ScaledValuesBase<AxisDomainRV>,
              val2: ScaledValuesBase<AxisDomainRV>,
              additionalCategories?: ScaledValuesCategorical) {
    this.setValues(val1)
    this.setValues(val2)
    this.additionalCategories = additionalCategories
  }
  private setValues(values: ScaledValuesBase<AxisDomainRV>) {
    if (values instanceof ScaledValuesLinear) this.linearValues = values
    if (values instanceof ScaledValuesCategorical) this.categoricalValues = values
  }

  aggregateIfPossible(): ScaledValuesLinear | undefined {
    const linearValues = this.linearValues
    const categoricalValues = this.categoricalValues
    if (!(linearValues) || !(categoricalValues)) return undefined

    const numberCategories = categoricalValues.categories.categoryOrder.length
    const numberValues = categoricalValues.categories.values.length
    const groupedValues: number[][] = new Array<null>(numberCategories).fill(null).map(() => [])
    const summedValues: number[] = new Array<number>(numberCategories).fill(0)
    const cumulativeValues: number[] = new Array<number>(numberValues).fill(0)

    const orderMap = categoricalValues.categories.categoryOrderMap
    categoricalValues.values.forEach((category, i) => {
      const categoryOrder = orderMap[category]
      const currentValue = linearValues.values[i]
      groupedValues[categoryOrder].push(currentValue)
      if (this.additionalCategories && !this.additionalCategories.isKeyActiveByIndex(i)) return
      cumulativeValues[i] = summedValues[categoryOrder]
      summedValues[categoryOrder] += linearValues.values[i]
    }, [])

    const aggregatedValuesOrder = groupedValues.map(vals => sum(vals))
    console.assert(aggregatedValuesOrder.length === categoricalValues.categories.categoryOrder.length)
    const aggregatedDomain = [linearValues.scale.domain()[0], Math.max(...aggregatedValuesOrder)]

    return new ScaledValuesLinear({values: cumulativeValues, scale: scaleLinear().domain(aggregatedDomain).nice()})
  }
}
