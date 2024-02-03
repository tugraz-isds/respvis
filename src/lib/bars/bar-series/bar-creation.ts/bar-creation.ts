import {getCurrentRespVal} from "../../../core/data/responsive-value/responsive-value";
import {elementFromSelection} from "../../../core/utilities/d3/util";
import {getSeriesItemCategoryData} from "../../../core/render/series";
import {Bar, SeriesBarValid} from "../bar-series-validation";
import {createGroupedBar} from "./bar-grouped-creation";
import {aggregateScaledValues} from "../../../core/data/scale/scaled-values-aggregation";
import {createStackedBar} from "./bar-stacked-creation";
import {RectScaleHandler} from "../../../core/data/scale/geometry-scale-handler/rect-scale-handler";

export function seriesBarCreateBars(seriesData: SeriesBarValid): Bar[] {
  const {renderer, keysActive, key: seriesKey} = seriesData
  const data: Bar[] = []

  const flipped = getCurrentRespVal(seriesData.flipped, {chart: elementFromSelection(renderer.chartSelection)})
  const [x, y] = [seriesData.x.cloneFiltered(), seriesData.y.cloneFiltered()]
  const geometryHandler = new RectScaleHandler({originalYValues: y, originalXValues: x, flipped})

  const [xAgg, yAgg] = [aggregateScaledValues(x, y), aggregateScaledValues(y, x)]

  if (!keysActive[seriesKey]) return data
  for (let i = 0; i < seriesData.y.values.length; ++i) {
    const categoryDataItem = getSeriesItemCategoryData({...seriesData, x, y, index: i, flipped})
    const {
      key, seriesCategory, styleClass, label,
      axisCategoryKeyX, axisCategoryKeyY
    } = categoryDataItem

    if (keysActive[seriesCategory] === false) continue
    if (!x.isKeyActive(axisCategoryKeyX) || !y.isKeyActive(axisCategoryKeyY)) continue

    const calcFinalBarRect = () => {
      if (seriesData.type === 'grouped' && seriesData.categories) return createGroupedBar({
        originalScaleHandler: geometryHandler, i, keysActive, categoryDataSeries: seriesData.categories
      })
      if (seriesData.type === 'stacked' && seriesData.categories && (xAgg || yAgg)) return createStackedBar({
        originalScaleHandler: geometryHandler, i, keysActive, aggScaledValues: (xAgg ?? yAgg)!,
        categoryDataSeries: seriesData.categories, categoryDataItem
      })
      return geometryHandler.getBarRect(i)
    }

    data.push({
      ...calcFinalBarRect(), xValue: seriesData.x.values[i], yValue: seriesData.y.values[i],
      label, styleClass, key
    });
  }
  return data;
}
