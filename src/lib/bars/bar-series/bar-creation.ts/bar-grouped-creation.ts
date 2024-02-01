import {AxisScaledValuesValid, Rect} from "../../../core";
import {scaleBand} from "d3";
import {SeriesItemCategory} from "../../../core/render/series/series-item-category";
import {CategoryValid} from "../../../core/data/category";
import {seriesGetActiveCategoryKeys} from "../../../core/render/series";

type createGroupedBarProps = {
  wholeBarRect: Rect
  x: AxisScaledValuesValid,
  y: AxisScaledValuesValid,
  i: number,
  flipped: boolean,
  categoryDataItem: SeriesItemCategory,
  categoryDataSeries: CategoryValid,
  keysActive: {[p: string]: boolean}
}
export function createGroupedBar(props: createGroupedBarProps) {
  const {wholeBarRect, i, y,
    flipped, x, categoryDataSeries, keysActive} = props

  const scaledValuesCategorical = (flipped ? y : x)
  const innerScaleRange = seriesGetActiveCategoryKeys(keysActive)

  const innerScale = scaleBand<string>()
    .domain(innerScaleRange)
    .range([0, scaledValuesCategorical.scale.bandwidth()])
    .padding(0.1); //TODO: create parameter for this

  const categoryKey = categoryDataSeries.valueKeys[i]
  const innerValue = innerScale(categoryKey) ?? 0

  return  {
    x: flipped ? wholeBarRect.x : wholeBarRect.x + innerValue,
    y: flipped ? wholeBarRect.y + innerValue : wholeBarRect.y,
    width: flipped ? wholeBarRect.width : innerScale.bandwidth(),
    height: flipped ? innerScale.bandwidth() : wholeBarRect.height
  }
}
