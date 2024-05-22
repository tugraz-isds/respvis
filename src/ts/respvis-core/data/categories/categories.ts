import {RespValOptional} from "../responsive-value/responsive-value";
import {arrayAlignLengths} from "../../utilities/array";
import {CategoryKey} from "../../constants/types";
import {getCategoryOrderArray, getCategoryOrderMap} from "respvis-core/data/categories/categories-util";

export type CategoriesUserArgs = {
  values: string[],
  title: RespValOptional<string>,
}

export type CategoriesArgs = CategoriesUserArgs & {
  parentKey: string
}

export type Categories = CategoriesArgs & {
  categoryOrderMap: Record<string, number>
  categoryOrder: string[]
  keyValues: CategoryKey[]
  keyOrder: CategoryKey[]
  styleClassOrder: string[]
  styleClassValues: string[]
}

export function validateCategories(referenceData: unknown[], args: CategoriesArgs): Categories  {
  const { values, parentKey, title} = args

  const [categoriesAligned] = arrayAlignLengths(args.values, referenceData)
  const categoryOrder = getCategoryOrderArray(categoriesAligned)
  const categoryOrderMap = getCategoryOrderMap(categoriesAligned)

  const keyValues = categoriesAligned.map((category) => `c-${categoryOrderMap[category]}` as CategoryKey)
  const keyOrder = categoryOrder.map((_, i) => `c-${i}` as CategoryKey)

  const styleClassValues = categoriesAligned.map((category) => `categorical-${categoryOrderMap[category]}`)
  const styleClassOrder = categoryOrder.map((l, i) => `categorical-${i}`)
  return {
    title,
    values,
    parentKey,
    categoryOrderMap,
    categoryOrder,
    keyValues,
    keyOrder,
    styleClassValues,
    styleClassOrder
  }
}
