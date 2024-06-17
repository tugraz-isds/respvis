import {RespValOptional} from "../responsive-value/responsive-value";
import {arrayAlignLengths} from "../../utilities/array";
import {CategoryKey} from "../../constants/types";
import {getCategoryOrderArray, getCategoryOrderMap} from "./categories-util";

export type CategoriesUserArgs = {
  values: string[],
  title: RespValOptional<string>,
  format?: ((value: string) => string) | Record<string, string>
}

export type CategoriesArgs = CategoriesUserArgs & {
  parentKey: string
}

export type Categories = Omit<CategoriesArgs, 'format'> & {
  categoryOrderMap: Record<string, number>
  categoryFormatMap: Record<string, string>
  categoryOrder: string[]
  keyValues: CategoryKey[]
  keyOrder: CategoryKey[]
  styleClassOrder: string[]
  styleClassValues: string[]
}

export function validateCategories(referenceData: unknown[], args: CategoriesArgs): Categories  {
  const { values, parentKey, title, format} = args

  const [categoriesAligned] = arrayAlignLengths(args.values, referenceData)
  const categoryOrder = getCategoryOrderArray(categoriesAligned)
  const categoryOrderMap = getCategoryOrderMap(categoriesAligned)

  const keyValues = categoriesAligned.map((category) => `c-${categoryOrderMap[category]}` as CategoryKey)
  const keyOrder = categoryOrder.map((_, i) => `c-${i}` as CategoryKey)

  const styleClassValues = categoriesAligned.map((category) => `categorical-${categoryOrderMap[category]}`)
  const styleClassOrder = categoryOrder.map((l, i) => `categorical-${i}`)

  const categoryFormatMap: Record<string, string> = categoryOrder.reduce((acc, val) => {
    acc[val] = (typeof format === "function") ? format(val) :
      (format && format[val]) ? format[val] :
        val
    return acc
  }, {})


  return {
    title,
    values,
    parentKey,
    categoryOrderMap,
    categoryFormatMap,
    categoryOrder,
    keyValues,
    keyOrder,
    styleClassValues,
    styleClassOrder
  }
}
