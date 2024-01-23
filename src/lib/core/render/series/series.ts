import {Size} from "../../utilities/size";
import {SeriesConfigTooltips, seriesConfigTooltipsData} from "../../../tooltip";
import {RenderArgs} from "../charts/renderer";
import {Point} from "../../../points";
import {AxisScale, axisScaleValidation} from "../../data/scale/axis-scale-validation";
import {AxisDomain} from "d3";
import {RespValOptional} from "../../data/responsive-value/responsive-value";
import {ToArray} from "../../constants/types";
import {getCategoryOrderArray, getCategoryOrderMap, validateCategories} from "../../data/category";
import {arrayAlignLengths} from "../../utilities/array";
import {RespValByValueOptional} from "../../data/responsive-value/responsive-value-value";

//TODO: Maybe rename series to cartesian series because of x and y values?
export type SeriesUserArgs = {
  xValues: ToArray<AxisDomain>,
  xScale?: AxisScale<AxisDomain>,
  yValues: ToArray<AxisDomain>,
  yScale?: AxisScale<AxisDomain>,
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

export type SeriesValid = Required<Omit<SeriesArgs, 'markerTooltips' | 'flipped'>> & {
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
  const [xValues, yValues] = arrayAlignLengths(data.xValues, data.yValues)
  const categories = validateCategories(xValues, data.categories)
  const categoryOrderArray = getCategoryOrderArray(categories)
  const categoryOrderMap = getCategoryOrderMap(categories)
  const keysActive = categoryOrderArray.reduce((prev, c, i) => {
    prev[`s-${key} c-${i}`] = true
    return prev
  }, {})
  const styleClasses = categoryOrderArray.map((l, i) => `categorical-${i}`)

  return { renderer, xValues, yValues,
    xScale: axisScaleValidation({ values: data.xValues, scale: data.xScale }),
    yScale: axisScaleValidation({ values: data.yValues, scale: data.yScale }),
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
