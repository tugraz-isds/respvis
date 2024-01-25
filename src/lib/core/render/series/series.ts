import {Size} from "../../utilities/size";
import {SeriesConfigTooltips, seriesConfigTooltipsData} from "../../../tooltip";
import {RenderArgs} from "../charts/renderer";
import {Point} from "../../../points";
import {
  AxisScaledValuesArg,
  AxisScaledValuesValid,
  axisScaledValuesValidation
} from "../../data/scale/axis-scaled-values-validation";
import {CategoryUserArgs, CategoryValid, validateCategories} from "../../data/category";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {alignScaledValuesLengths} from "../../data/scale/scaled-values";
import {SeriesKey} from "../../constants/types";

//TODO: Maybe rename series to cartesian series because of x and y values?
export type SeriesUserArgs = {
  x: AxisScaledValuesArg
  y: AxisScaledValuesArg
  categories?: CategoryUserArgs
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>
  labelCallback?: (category: string) => string,
  flipped?: RespValByValueOptional<boolean>
}

export type SeriesArgs = SeriesUserArgs & RenderArgs & {
  key: SeriesKey
  bounds?: Size,
}

export type SeriesValid = Required<Omit<SeriesArgs, 'markerTooltips' | 'flipped' | 'x' | 'y' | 'categories'>> & {
  x: AxisScaledValuesValid
  y: AxisScaledValuesValid
  categories?: CategoryValid
  markerTooltips: SeriesConfigTooltips<SVGCircleElement, Point>
  flipped: RespValByValueOptional<boolean>
  keysActive: {
    [key: string]: boolean
  }
}

export function seriesValidation(data: SeriesArgs): SeriesValid {
  const {key, renderer, flipped,
    labelCallback, categories} = data
  const [xAligned, yAligned] = alignScaledValuesLengths(data.x, data.y) //<typeof data.x.values, typeof data.y.values>
  const x = axisScaledValuesValidation(xAligned)
  const y = axisScaledValuesValidation(yAligned)
  const categoriesValid = categories ? validateCategories(x.values, {...categories, parentKey: `s-${key}`}) : undefined

  const keysActive = {}
  keysActive[key] = true
  categoriesValid?.orderKeys.reduce((prev, c) => {
    prev[`${key} ${c}`] = true
    return prev
  }, keysActive)

  return { renderer, x, y,
    categories: categoriesValid,
    bounds: data.bounds || { width: 600, height: 400 },
    key,
    keysActive,
    markerTooltips: seriesConfigTooltipsData(data.markerTooltips),
    labelCallback: labelCallback ? labelCallback : (label: string) => label,
    flipped: flipped ?? false
  }
}

export function getSeriesItemCategoryData(series: SeriesValid, index: number) {
  const {categories, key: seriesKey, labelCallback} = series

  const category = categories?.values[index]
  const categoryKey = categories?.valueKeys[index]
  const seriesCategory = `${seriesKey}${categoryKey ? ` ${categoryKey}` : ''}`
  const key = `${seriesCategory} i-${index}`
  const styleClass = (categories && category) ? `categorical-${categories.orderMap[category]}` : 'categorical-0'
  const label = labelCallback(category ?? '')
  return {styleClass, key, seriesCategory, label}
}
