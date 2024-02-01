import {AxisScaledValuesValid, Rect} from "../../../core";
import {SeriesItemCategory} from "../../../core/render/series/series-item-category";
import {CategoryValid} from "../../../core/data/category";
import {ScaledValuesLinearValid} from "../../../core/data/scale/scaled-values";

type createStackedBarProps = {
  wholeBarRect: Rect
  x: AxisScaledValuesValid,
  aggScaledValues: ScaledValuesLinearValid
  y: AxisScaledValuesValid,
  i: number,
  flipped: boolean,
  categoryDataItem: SeriesItemCategory,
  categoryDataSeries: CategoryValid,
  keysActive: {[p: string]: boolean}
}
export function createStackedBar(props: createStackedBarProps) {
  const {wholeBarRect, i, y,
    flipped, x, categoryDataSeries,
    keysActive, aggScaledValues} = props

  const scaledValuesOriginalY = (flipped ? x : y)

  const scaledValuesOriginalYRange = scaledValuesOriginalY.scale.range()
  aggScaledValues.scale.range(scaledValuesOriginalYRange) //TODO: adapt axis! .domain([0, 100])
  if (!flipped) {
    const scaledValuesOriginalYRangeInverted = [scaledValuesOriginalYRange[1], scaledValuesOriginalYRange[0]]
    aggScaledValues.scale.range(scaledValuesOriginalYRangeInverted) //TODO: adapt axis! .domain([0, 100])
  }

  // const innerScaleDomain = seriesGetActiveCategoryKeys(aggScaledValues.scale.domain())
  // const categoryKey = categoryDataSeries.valueKeys[i]
  // const innerValue = innerScale(categoryKey) ?? 0
  // const yScaleDown = aggScaledValues.scale.copy().domain(aggScaledValues.sc)

  const innerValueStart = aggScaledValues.scale(aggScaledValues.values[i])
  return  {
    x: flipped ? wholeBarRect.x + innerValueStart : wholeBarRect.x,
    y: flipped ? wholeBarRect.y : aggScaledValues.scale.range()[1] - innerValueStart - aggScaledValues.scale(y.values[i]),
    width: flipped ? aggScaledValues.scale(x.values[i]) : wholeBarRect.width,
    height: flipped ? wholeBarRect.height : aggScaledValues.scale(y.values[i])
  }
}
