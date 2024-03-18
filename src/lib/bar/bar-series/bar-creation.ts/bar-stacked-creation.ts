import {CategoryValid} from "../../../core/data/category";
import {RectScaleHandler} from "../../../core/data/scale/geometry-scale-handler/rect-scale-handler";
import {ScaledValuesLinear} from "../../../core/data/scale/scaled-values-linear";
import {ScaledValuesDate} from "../../../core/data/scale/scaled-values-date";

type createStackedBarProps = {
  originalScaleHandler: RectScaleHandler
  aggScaledValues: ScaledValuesLinear
  i: number,
  categoryDataSeries: CategoryValid,
  keysActive: {[p: string]: boolean}
}
export function createStackedBar(props: createStackedBarProps) {
  const {i, originalScaleHandler, aggScaledValues} = props

  const scaledValuesOriginalY = originalScaleHandler.originalYValues
  const flipped = originalScaleHandler.currentlyFlipped()
  const wholeBarRect = originalScaleHandler.getBarRect(i)


  const scaledValuesOriginalYRange = scaledValuesOriginalY.scale.range()
  aggScaledValues.scale.range(scaledValuesOriginalYRange)
  if (!flipped) {
    const scaledValuesOriginalYRangeInverted = [scaledValuesOriginalYRange[1], scaledValuesOriginalYRange[0]]
    aggScaledValues.scale.range(scaledValuesOriginalYRangeInverted)
  }

  const innerValueStart = aggScaledValues.scale(aggScaledValues.values[i])

  function getHorizontalStackedBar() {
    const x = originalScaleHandler.getCurrentXValues() as (ScaledValuesLinear | ScaledValuesDate)
    return  {
      x: wholeBarRect.x + innerValueStart,
      y: wholeBarRect.y,
      width: aggScaledValues.scale(x.values[i]),
      height: wholeBarRect.height
    }
  }

  function getVerticalStackedBar() {
    const y = originalScaleHandler.getCurrentYValues() as (ScaledValuesLinear | ScaledValuesDate)
    return  {
      x: wholeBarRect.x,
      y: aggScaledValues.scale.range()[1] - innerValueStart - aggScaledValues.scale(y.values[i]),
      width: wholeBarRect.width,
      height: aggScaledValues.scale(y.values[i])
    }
  }

  return  flipped ? getHorizontalStackedBar() : getVerticalStackedBar()
}
