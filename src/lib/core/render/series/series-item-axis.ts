import {AxisScaledValuesValid} from "../../data/scale/axis-scaled-values-validation";
import {isScaledValuesCategorical} from "../../data/scale/scaled-values";

export function getSeriesItemAxisData(axis: AxisScaledValuesValid, index: number) {
  if (!isScaledValuesCategorical(axis)) return {
    styleClass: '', axisCategoryKey: ''
  }
  const {parentKey, categories} = axis
  const axisKey = parentKey
  const category = categories.values[index]
  const categoryKey = categories.valueKeys[index]
  const axisCategoryKey = `${axisKey}-${categoryKey}`
  const styleClass = `${axisKey}-categorical-${categories.orderMap[category]}`
  return {styleClass, axisCategoryKey}
}
