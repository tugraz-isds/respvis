import {scaleBand} from "d3";
import {CategoryValid} from "../../../core/data/category";
import {seriesGetActiveCategoryKeys} from "../../../core/render/series";
import {RectScaleHandler} from "../../../core/data/scale/geometry-scale-handler/rect-scale-handler";
import {ActiveKeyMap} from "../../../core/constants/types";

type createGroupedBarProps = {
  originalScaleHandler: RectScaleHandler
  i: number,
  categoryDataSeries: CategoryValid,
  keysActive: ActiveKeyMap
}
export function createGroupedBar(props: createGroupedBarProps) {
  const {i, originalScaleHandler, categoryDataSeries,
    keysActive} = props

  // TODO: assumes original x to be categorical axis
  const categoryGroupValues = originalScaleHandler.renderState.originalXValues
  const flipped = originalScaleHandler.renderState.flipped
  const wholeBarRect = originalScaleHandler.getBarRect(i)

  const innerScaleDomain = seriesGetActiveCategoryKeys(keysActive)
  const innerScale = scaleBand<string>()
    .domain(innerScaleDomain)
    .range([0, categoryGroupValues.scale.bandwidth()])
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
