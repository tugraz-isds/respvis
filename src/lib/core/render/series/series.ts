import {Size} from "../../utilities/size";
import {SeriesConfigTooltips, seriesConfigTooltipsData} from "../../../tooltip";
import {RenderArgs} from "../charts/renderer";
import {Point} from "../../../points";
import {
  AxisScaledValuesArg,
  AxisScaledValuesValid,
  axisScaledValuesValidation
} from "../../data/scale/axis-scaled-values-validation";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {getCategoryOrderArray, getCategoryOrderMap, validateCategories} from "../../data/category";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";
import {alignScaledValuesLengths} from "../../data/scale/scaled-values";

//TODO: Maybe rename series to cartesian series because of x and y values?
export type SeriesUserArgs = {
  x: AxisScaledValuesArg
  y: AxisScaledValuesArg
  categories?: string[],
  categoriesTitle?: RespValOptional<string>,
  markerTooltips?: Partial<SeriesConfigTooltips<SVGCircleElement, Point>>
  labelCallback?: (category: string) => string,
  flipped?: RespValByValueOptional<boolean>
}

export type SeriesArgs = SeriesUserArgs & RenderArgs & {
  key: string
  bounds?: Size,
}

export type SeriesValid = Required<Omit<SeriesArgs, 'markerTooltips' | 'flipped' | 'x' | 'y'>> & {
  x: AxisScaledValuesValid
  y: AxisScaledValuesValid
  markerTooltips: SeriesConfigTooltips<SVGCircleElement, Point>
  flipped: RespValByValueOptional<boolean>
  categoryOrderMap: Record<string, number>
  keys: string[]
  keysActive: {
    [key: string]: boolean
  }
  styleClasses: string[]
}

export function seriesValidation(data: SeriesArgs): SeriesValid {
  const {key, renderer, flipped, labelCallback} = data
  const [xAligned, yAligned] = alignScaledValuesLengths(data.x, data.y) //<typeof data.x.values, typeof data.y.values>
  const x = axisScaledValuesValidation(xAligned)
  const y = axisScaledValuesValidation(yAligned)
  const categories = validateCategories(x.values, data.categories)
  const categoryOrderArray = getCategoryOrderArray(categories)
  const categoryOrderMap = getCategoryOrderMap(categories)
  const keysActive = categoryOrderArray.reduce((prev, c, i) => {
    prev[`s-${key} c-${i}`] = true
    return prev
  }, {})
  const styleClasses = categoryOrderArray.map((l, i) => `categorical-${i}`)

  return { renderer, x, y,
    bounds: data.bounds || { width: 600, height: 400 },
    categoriesTitle: data.categoriesTitle ?? 'Categories',
    categories,
    categoryOrderMap,
    keysActive,
    key,
    styleClasses,
    markerTooltips: seriesConfigTooltipsData(data.markerTooltips),
    labelCallback: labelCallback ? labelCallback : (label: string) => label,
    keys: categories.map((_, i) => `s-${key} c-${i}`),
    flipped: flipped ?? false
  }
}
