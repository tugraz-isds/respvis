import {getCurrentRespVal} from "../../../core/data/responsive-value/responsive-value";
import {elementFromSelection} from "../../../core/utilities/d3/util";
import {Bar, SeriesBarValid} from "../bar-series-validation";
import {createGroupedBar} from "./bar-grouped-creation";
// import {aggregateScaledValues} from "../../../core/data/scale/scaled-values-aggregation";
import {createStackedBar} from "./bar-stacked-creation";
import {RectScaleHandler} from "../../../core/data/scale/geometry-scale-handler/rect-scale-handler";
import {defaultStyleClass} from "../../../core/constants/other";
import {ScaledValuesAggregation} from "../../../core/data/scale/scaled-values-aggregation";

export function seriesBarCreateBars(seriesData: SeriesBarValid): Bar[] {
  const {renderer, keysActive, key: seriesKey, categories} = seriesData
  const data: Bar[] = []

  const flipped = getCurrentRespVal(seriesData.flipped, {chart: elementFromSelection(renderer.chartSelection)})
  const [x, y] = [seriesData.x.cloneFiltered(), seriesData.y.cloneFiltered()]
  const geometryHandler = new RectScaleHandler({originalYValues: y, originalXValues: x, flipped})

  const aggScaledValues = new ScaledValuesAggregation(x, y, categories).aggregateIfPossible()

  if (!keysActive[seriesKey]) return data
  for (let i = 0; i < seriesData.y.values.length; ++i) {
    if (categories && !categories.isKeyActiveByIndex(i)) continue
    if (!x.isKeyActiveByIndex(i) || !y.isKeyActiveByIndex(i)) continue

    const calcFinalBarRect = () => {
      if (seriesData.type === 'grouped' && seriesData.categories) return createGroupedBar({
        originalScaleHandler: geometryHandler, i, categories: seriesData.categories
      })
      if (seriesData.type === 'stacked' && seriesData.categories && aggScaledValues) return createStackedBar({
        originalScaleHandler: geometryHandler, i, keysActive, aggScaledValues,
        categoryDataSeries: seriesData.categories.categories
      })
      return geometryHandler.getBarRect(i)
    }

    data.push({
      ...calcFinalBarRect(),
      xValue: seriesData.x.values[i],
      yValue: seriesData.y.values[i],
      styleClass: seriesData.categories?.categories.styleClassValues[i] ?? defaultStyleClass,
      label: seriesData.labelCallback(seriesData.categories?.values[i] ?? ''),
      key: seriesData.getCombinedKey(i) + ` i-${i}`,
    });
  }
  return data;
}
