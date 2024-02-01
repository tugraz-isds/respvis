import {AxisScaledValuesValid, getFilteredScaledValues, getFlippedScaledValues, Rect} from "../../../core";
import {getCurrentRespVal} from "../../../core/data/responsive-value/responsive-value";
import {elementFromSelection} from "../../../core/utilities/d3/util";
import {getSeriesItemCategoryData} from "../../../core/render/series";
import {isScaledValuesCategorical} from "../../../core/data/scale/scaled-values";
import {Bar, SeriesBarValid} from "../bar-series-validation";
import {createGroupedBar} from "./bar-grouped-creation";

export function seriesBarCreateBars(seriesData: SeriesBarValid): Bar[] {
  const {
    renderer,
    keysActive, key: seriesKey
  } = seriesData
  const data: Bar[] = []

  const {x: xFlipped, y: yFlipped} = getFlippedScaledValues(seriesData)
  const [x, y] = [getFilteredScaledValues(xFlipped), getFilteredScaledValues(yFlipped)]
  const flipped = getCurrentRespVal(seriesData.flipped, {chart: elementFromSelection(renderer.chartSelection)})


  if (!keysActive[seriesKey]) return data
  for (let i = 0; i < seriesData.y.values.length; ++i) {
    // const xOriginalVal = seriesData.x.values[i]
    // const yOriginalVal = seriesData.y.values[i]

    const categoryDataItem = getSeriesItemCategoryData({...seriesData, x, y, index: i, flipped})
    const {
      key, seriesCategory, styleClass, label,
      axisCategoryKeyX, axisCategoryKeyY
    } = categoryDataItem

    if (keysActive[seriesCategory] === false) continue
    if (isScaledValuesCategorical(x) && x.keysActive[axisCategoryKeyX] === false ||
      isScaledValuesCategorical(y) && y.keysActive[axisCategoryKeyY] === false) continue

    const wholeBarRect = getBarRect(x, y, i, flipped)
    let finalBarRect: Rect
    if (seriesData.categories && seriesData.type !== 'standard') {
      const barProps = {wholeBarRect, x, y, flipped, i,
        categoryDataItem, categoryDataSeries: seriesData.categories, keysActive
      }
      finalBarRect = createGroupedBar(barProps)
    } else finalBarRect = wholeBarRect

    const bar: Bar = {
      ...finalBarRect, xValue: seriesData.x.values[i], yValue: seriesData.y.values[i],
      label, styleClass, key
    }

    data.push(bar);
  }
  return data;
}

export function getBarRect(x: AxisScaledValuesValid, y: AxisScaledValuesValid, i: number, flipped: boolean) {
  return flipped ? getHorizontalBarRect(x, y, i) : getVerticalBarRect(x, y, i)
}

function getHorizontalBarRect(x: AxisScaledValuesValid, y: AxisScaledValuesValid, i: number): Rect {
  return {
    x: Math.min(x.scale(0)!, x.scale(x.values[i])!),
    y: y.scale(y.values[i])!,
    width: Math.abs(x.scale(0)! - x.scale(x.values[i])!),
    height: y.scale.bandwidth()
  }
}

function getVerticalBarRect(x: AxisScaledValuesValid, y: AxisScaledValuesValid, i: number): Rect {
  return {
    x: x.scale(x.values[i])!,
    y: Math.min(y.scale(0)!, y.scale(y.values[i])!),
    width: x.scale.bandwidth(),
    height: Math.abs(y.scale(0)! - y.scale(y.values[i])!)
  }
}
