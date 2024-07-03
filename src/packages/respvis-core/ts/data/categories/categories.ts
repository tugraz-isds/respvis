import {RespVal, RespValUserArgs, validateRespVal} from "../responsive-value/responsive-value";
import {arrayAlignLengths, clearDuplicatedValues} from "../../utilities/array";
import {CategoryKey} from "../../constants/types";

/**
 * @property values - length must match number of all data records in use
 */
export type CategoriesUserArgs = {
  values: string[],
  title: RespValUserArgs<string>,
  format?: ((value: string) => string) | Record<string, string>
}

export type CategoriesArgs = CategoriesUserArgs & {
  parentKey: string
}

export type Categories = Omit<CategoriesArgs, 'format' | 'title'> & {
  title: RespVal<string>
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
  const { values, parentKey, title, format} = args

  const [categoriesAligned] = arrayAlignLengths(args.values, referenceData ?? args.values)
  const categoryOrder = clearDuplicatedValues(categoriesAligned)

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
    title: validateRespVal(title),
    values,
    parentKey,
    categoryMap,
    categoryArray
  }
}
