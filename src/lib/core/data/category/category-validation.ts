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
  orderMap: Record<string, number>
  valueKeys: CategoryKey[]
  orderKeys: CategoryKey[]
  styleClasses: string[]
}

export function validateCategories(referenceData: unknown[], categoryArgs?: CategoryArgs): CategoryValid | undefined {
  if (!categoryArgs) return undefined
  const { values, parentKey, title} = categoryArgs

  // console.log(categoryArgs, t)
  const [categoriesAligned] = arrayAlignLengths(categoryArgs.values, referenceData)
  const orderArray = getCategoryOrderArray(categoriesAligned)
  const orderMap = getCategoryOrderMap(categoriesAligned)
  const valueKeys = categoriesAligned.map((category) => `c-${orderMap[category]}` as CategoryKey)
  const orderKeys = orderArray.map((_, i) => `c-${i}` as CategoryKey)
  const styleClasses = orderArray.map((l, i) => `categorical-${i}`)
  return {
    title, //?? 'Categories',
    values,
    parentKey,
    orderMap,
    valueKeys,
    orderKeys,
    styleClasses,
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

// export function

export function groupByCategory<T>(values: T[], categories: string[]) {
  const groupedData: { [category: string]: T[] } = {};

  for (let i = 0; i < values.length; i++) {
    const category = categories[i]
    const value = values[i]
    if (!groupedData[category]) {
      groupedData[category] = [value]
      continue
    }
    groupedData[category].push(value)
  }
  // const groups: T[][] = Object.values(groupedData)
  return groupedData;
}
