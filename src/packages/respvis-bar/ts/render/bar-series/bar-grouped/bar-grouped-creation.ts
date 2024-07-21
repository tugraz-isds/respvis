import {scaleBand} from "d3";
import {getActiveKeys, Rect, ScaledValuesCategorical} from "respvis-core";
import {BarGroupedSeries} from "./bar-grouped-series";

export function createGroupedBarRect(series: BarGroupedSeries, i: number): Rect {

  const flipped = series.responsiveState.currentlyFlipped
  const categoryGroupValues = flipped ? series.responsiveState.verticalVals() : series.responsiveState.horizontalVals()
  const wholeBarRect = series.responsiveState.getBarBaseRect(i)

  const innerScaleDomain = getActiveKeys(series.categories.keysActive)
  const innerScale = scaleBand<string>()
    .domain(innerScaleDomain)
    .range([0, (categoryGroupValues as ScaledValuesCategorical).scale.bandwidth()])
    .padding(0.1); //TODO: create parameter for this

  const categoryKey = series.categories.getCombinedKey(i)
  const innerValue = innerScale(categoryKey) ?? 0

  return  {
    x: flipped ? wholeBarRect.x : wholeBarRect.x + innerValue,
    y: flipped ? wholeBarRect.y + innerValue : wholeBarRect.y,
    width: flipped ? wholeBarRect.width : innerScale.bandwidth(),
    height: flipped ? innerScale.bandwidth() : wholeBarRect.height
  }
}
