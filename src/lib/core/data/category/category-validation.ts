import {RespValOptional} from "../responsive-value/responsive-value";
import {arrayAlignLengths} from "../../utilities/array";
import {CategoryKey} from "../../constants/types";

export const defaultCategory = 'category-default'

export type CategoryUserArgs = {
  values: string[],
  title: RespValOptional<string>,
}

export type CategoryArgs = CategoryUserArgs & {
  parentKey: string
}

export type CategoryValid = CategoryArgs & {
  categoryOrderMap: Record<string, number>
  categoryOrder: string[]
  keyValues: CategoryKey[]
  keyOrder: CategoryKey[]
  styleClassOrder: string[]
  styleClassValues: string[]
}

export function categoriesValidation(referenceData: unknown[], categoryArgs: CategoryArgs): CategoryValid  {
  const { values, parentKey, title} = categoryArgs

  const [categoriesAligned] = arrayAlignLengths(categoryArgs.values, referenceData)
  const categoryOrder = getCategoryOrderArray(categoriesAligned)
  const categoryOrderMap = getCategoryOrderMap(categoriesAligned)

  const keyValues = categoriesAligned.map((category) => `c-${categoryOrderMap[category]}` as CategoryKey)
  const keyOrder = categoryOrder.map((_, i) => `c-${i}` as CategoryKey)

  const styleClassValues = categoriesAligned.map((category) => `categorical-${categoryOrderMap[category]}`)
  const styleClassOrder = categoryOrder.map((l, i) => `categorical-${i}`)
  return {
    title, //?? 'Categories',
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

export function getCategoryOrderArray(categoryDim: string[]) {
  return categoryDim.reduce<string[]>(
    (prev, current) => prev.includes(current) ? prev : [...prev, current], [])
}

type CategoryOrderMap = Record<string, number>
export function getCategoryOrderMap(categoryDim: string[]): CategoryOrderMap {
  const categoryOrderArray = getCategoryOrderArray(categoryDim)
  return categoryOrderArray.reduce((prev, current, index) => {
    prev[current] = index
    return prev
  }, {})
}

export function categoryOrderMapToArray(map: CategoryOrderMap) {
  const array = Object.keys(map)
  const arraySorted = new Array<string>(array.length)
  for (let i = 0; i < array.length; i++) {
    arraySorted[map[array[i]]] = array[i]
  }
  return arraySorted
}
