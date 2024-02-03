import {isScaledValuesCategorical, isScaledValuesLinear, ScaledValuesLinearValid} from "./scaled-values";
import {AxisDomainRV, AxisScaledValuesValid} from "./axis-scaled-values-validation";
import {sum} from "../../utilities/array";
import {scaleLinear} from "d3";
import {ScaledValuesBase} from "./scaled-values-base";
import {ScaledValuesLinear} from "./scaled-values-linear";
import {ScaledValuesCategorical} from "./scaled-values-categorical";

export function aggregateScaledValues(linearValues: ScaledValuesBase<AxisDomainRV>,
                                      categoricalValues: ScaledValuesBase<AxisDomainRV>): ScaledValuesLinear | undefined {
  if (!(linearValues instanceof ScaledValuesLinear) || !(categoricalValues instanceof ScaledValuesCategorical)) return undefined
  const numberCategories = categoricalValues.categories.orderArray.length
  const numberValues = categoricalValues.categories.values.length
  const groupedValues: number[][] = new Array<null>(numberCategories).fill(null).map(() => [])
  const summedValues: number[] = new Array<number>(numberCategories).fill(0)
  const cumulativeValues: number[] = new Array<number>(numberValues).fill(0)

  const orderMap = categoricalValues.categories.orderMap
  categoricalValues.values.forEach((category, i) => {
    const categoryOrder = orderMap[category]
    const currentValue = linearValues.values[i]
    cumulativeValues[i] = summedValues[categoryOrder]
    summedValues[categoryOrder] += linearValues.values[i]
    groupedValues[categoryOrder].push(currentValue)
  }, [])

  const aggregatedValuesOrder = groupedValues.map(vals => sum(vals))
  console.assert(aggregatedValuesOrder.length === categoricalValues.categories.orderArray.length)
  const aggregatedDomain = [linearValues.scale.domain()[0], Math.max(...aggregatedValuesOrder)]

  return new ScaledValuesLinear({values: cumulativeValues, scale: scaleLinear().domain(aggregatedDomain).nice()})
}
