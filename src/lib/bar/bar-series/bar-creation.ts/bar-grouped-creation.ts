import {scaleBand} from "d3";
import {getActiveKeys} from "core/utilities/dom/key";
import {ScaledValuesCategorical} from "core/data/scale/scaled-values-categorical";
import {BarGroupedSeries} from "../bar-grouped-series";

type createGroupedBarProps = {
  series: BarGroupedSeries
  i: number
}
export function createGroupedBar(props: createGroupedBarProps) {
  const {i, series} = props

  const flipped = series.responsiveState.currentlyFlipped
  const categoryGroupValues = flipped ? series.responsiveState.currentYVals() : series.responsiveState.currentXVals()
  const wholeBarRect = series.responsiveState.getBarRect(i)

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
