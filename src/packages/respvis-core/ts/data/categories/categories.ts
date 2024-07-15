import {RVArray} from "../../utilities/array";
import {CategoryGroupPrefix, CategoryPrefix} from "../../constants/types";
import {
  isResponsiveValueUserArgsResponsive,
  ResponsiveValueOptional,
  ResponsiveValueUserArgs,
  validateResponsiveValue
} from "../responsive-property";
import {Key} from "../../utilities";
import groupBy = RVArray.groupBy;
import isStringArray = RVArray.isStringArray;

/**
 * @property values - length must match number of all data records in use
 */
export type CategoriesUserArgs = {
  values: string[],
  title: ResponsiveValueUserArgs<string>,
  format?: ((value: string) => string) | Record<string, string>
  key?: number
}

export function isCategoryUserArgs(args: any): args is CategoriesUserArgs {
  return isStringArray(args.values) &&
    (typeof args.title === "string" || isResponsiveValueUserArgsResponsive(args.title))
}

export type CategoriesArgs = CategoriesUserArgs & {
  sharedValues: string[]
  key: number
}

export type Categories = Omit<CategoriesArgs, 'format' | 'title' | 'key' | 'sharedValues'> & {
  tag: 'categories'
  title: ResponsiveValueOptional<string>
  categoryMap: Record<string, Category>
  categoryArray: Category[]
  key: Key<CategoryGroupPrefix>
  getActiveCategories: () => Category[]
}

type Category = {
  key: Key<CategoryPrefix>
  styleClass: string
  order: number
  formatValue: string
  value: string
}

export function isCategories(args: any): args is Categories { return args.tag === 'categories' }

export function validateCategories(args: CategoriesArgs, referenceData?: unknown[]): Categories  {
  const { values, key, title, format} = args

  const [categoriesAligned] = RVArray.equalizeLengths(args.values, referenceData ?? args.values)
  const categoryOrder = RVArray.clearDuplicatedValues(args.sharedValues)

  const categoryMap: Record<string, Category> = categoryOrder.reduce((acc: Record<string, Category>, current, index) => {
    acc[current] = {
      order: index,
      value: current,
      formatValue: (typeof format === "function") ? format(current) :
        (format && format[current]) ? format[current] : current,
      styleClass: `categorical-${index}`,
      key: new Key(`c`, [key, index])
    }
    return acc
  }, {})

  const categoryArray: Category[] = Object.values(categoryMap).sort((a, b) => a.order > b.order ? 1 : -1)

  return {
    tag: 'categories',
    title: validateResponsiveValue(title),
    values,
    key: new Key(`cg`, [key]),
    categoryMap,
    categoryArray,
    getActiveCategories: function (this: Categories) {
      return Object.values(this.categoryMap).filter(category => category.key.active)
    }
  }
}


export function validateCategoryCollection(args: CategoriesUserArgs[]) {

  function assignKeysToCategoryUserArgsInline(): (CategoriesUserArgs & {key: number})[] {
    const possibleKeys = args.map((_, index) => index)
    const keysReserved: boolean[] = Array(args.length).fill(false)
    keysReserved.forEach((_, index) => {
      if (typeof args[index].key === 'number') keysReserved[index] = true
    })
    const freeKeys = possibleKeys.filter((index) => !keysReserved[index])
    args.forEach(arg => {
      if (typeof arg.key !== 'number') {
        arg.key = freeKeys.shift()
      }
    })
    return args as (CategoriesUserArgs & {key: number})[]
  }

  function assignSharedValues(): CategoriesArgs[] {
    const argsWithKeys = assignKeysToCategoryUserArgsInline()
    const argsGroupedByKeys = groupBy(argsWithKeys, "key")
    return argsWithKeys.map(arg => {
      const sharedValues = argsGroupedByKeys[arg.key].reduce((acc, value) => {
        return [...acc, ...value.values]
      }, [] as string[])
      return {...arg, sharedValues}
    })
  }

  return assignSharedValues().map(args => validateCategories(args, args.values))
}
