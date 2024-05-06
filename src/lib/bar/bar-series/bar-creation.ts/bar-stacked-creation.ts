import {ScaledValuesLinear} from "core/data/scale/scaled-values-linear";
import {ScaledValuesDate} from "core/data/scale/scaled-values-date";
import {BarStackedSeries} from "../bar-stacked-series";

type createStackedBarProps = {
  series: BarStackedSeries
  i: number
}
export function createStackedBar(props: createStackedBarProps) {
  const {i, series} = props
  const {responsiveState} = series
  const aggScaledValues = series.aggScaledValues.aggregateCached()

  const scaledValuesOriginalY = series.y
  const flipped = responsiveState.currentlyFlipped
  const wholeBarRect = responsiveState.getBarRect(i)


  const scaledValuesOriginalYRange = scaledValuesOriginalY.scale.range()
  aggScaledValues.scale.range(scaledValuesOriginalYRange)
  if (!flipped) {
    const scaledValuesOriginalYRangeInverted = [scaledValuesOriginalYRange[1], scaledValuesOriginalYRange[0]]
    aggScaledValues.scale.range(scaledValuesOriginalYRangeInverted)
  }

  const innerValueStart = aggScaledValues.scale(aggScaledValues.values[i])

  function getHorizontalStackedBar() {
    const x = series.y as (ScaledValuesLinear | ScaledValuesDate)
    return  {
      x: wholeBarRect.x + innerValueStart,
      y: wholeBarRect.y,
      width: aggScaledValues.scale(x.values[i]),
      height: wholeBarRect.height
    }
  }

  function getVerticalStackedBar() {
    const y = series.y as (ScaledValuesLinear | ScaledValuesDate)
    return  {
      x: wholeBarRect.x,
      y: aggScaledValues.scale.range()[1] - innerValueStart - aggScaledValues.scale(y.values[i]),
      width: wholeBarRect.width,
      height: aggScaledValues.scale(y.values[i])
    }
  }

  return flipped ? getHorizontalStackedBar() : getVerticalStackedBar()
}
