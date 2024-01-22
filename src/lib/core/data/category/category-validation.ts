export const defaultCategory = 'category-default'
export function validateCategories(values: unknown[], categories?: string[]) {
  if (!categories) return values.map(() => defaultCategory)
  const lowerLength = values.length < categories.length ? values.length : categories.length
  return categories.slice(0, lowerLength)
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
