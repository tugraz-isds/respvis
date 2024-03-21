import {scaleBand} from "d3";
import {RectScaleHandler} from "../../../core/data/scale/geometry-scale-handler/rect-scale-handler";
import {getActiveKeys} from "../../../core/utilities/dom/key";
import {ScaledValuesCategorical} from "../../../core/data/scale/scaled-values-categorical";

type createGroupedBarProps = {
  originalScaleHandler: RectScaleHandler
  i: number,
  categories: ScaledValuesCategorical,
}
export function createGroupedBar(props: createGroupedBarProps) {
  const {i, originalScaleHandler, categories} = props

  // TODO: assumes original x to be categorical axis
  const categoryGroupValues = originalScaleHandler.originalXValues
  const flipped = originalScaleHandler.currentlyFlipped()
  const wholeBarRect = originalScaleHandler.getBarRect(i)

  const innerScaleDomain = getActiveKeys(categories.keysActive)
  const innerScale = scaleBand<string>()
    .domain(innerScaleDomain)
    .range([0, categoryGroupValues.scale.bandwidth()])
    .padding(0.1); //TODO: create parameter for this

  const categoryKey = categories.getCombinedKey(i)
  const innerValue = innerScale(categoryKey) ?? 0

  return  {
    x: flipped ? wholeBarRect.x : wholeBarRect.x + innerValue,
    y: flipped ? wholeBarRect.y + innerValue : wholeBarRect.y,
    width: flipped ? wholeBarRect.width : innerScale.bandwidth(),
    height: flipped ? innerScale.bandwidth() : wholeBarRect.height
  }
}
