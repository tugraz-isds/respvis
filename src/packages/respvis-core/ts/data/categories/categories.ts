import {RVArray} from "../../utilities/array";
import {CategoryKey} from "../../constants/types";
import {ResponsiveValueOptional, ResponsiveValueUserArgs, validateResponsiveValue} from "../responsive-property";

/**
 * @property values - length must match number of all data records in use
 */
export type CategoriesUserArgs = {
  values: string[],
  title: ResponsiveValueUserArgs<string>,
  format?: ((value: string) => string) | Record<string, string>
}

export type CategoriesArgs = CategoriesUserArgs & {
  categoriesKey: string
}

export type Categories = Omit<CategoriesArgs, 'format' | 'title'> & {
  title: ResponsiveValueOptional<string>
  categoryMap: Record<string, Category>
  categoryArray: Category[]
}

type Category = {
  key: CategoryKey
  styleClass: string
  order: number
  formatValue: string
  value: string
}

export function validateCategories(args: CategoriesArgs, referenceData?: unknown[]): Categories  {
  const { values, categoriesKey, title, format} = args

  const [categoriesAligned] = RVArray.equalizeLengths(args.values, referenceData ?? args.values)
  const categoryOrder = RVArray.clearDuplicatedValues(categoriesAligned)

  const categoryMap: Record<string, Category> = categoryOrder.reduce((acc: Record<string, Category>, current, index) => {
    acc[current] = {
      order: index,
      value: current,
      formatValue: (typeof format === "function") ? format(current) :
        (format && format[current]) ? format[current] : current,
      styleClass: `categorical-${index}`,
      key: `c-${index}` as CategoryKey
    }
    return acc
  }, {})

  const categoryArray: Category[] = Object.values(categoryMap).sort((a, b) => a.order > b.order ? 1 : -1)

  return {
    title: validateResponsiveValue(title),
    values,
    categoriesKey,
    categoryMap,
    categoryArray
  }
}
