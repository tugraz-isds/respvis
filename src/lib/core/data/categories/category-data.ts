export const defaultCategory = 'category-default'
export function validateCategories(values: unknown[], categories?: string[]) {
  if (!categories) return values.map(() => defaultCategory)
  const lowerLength = values.length < categories.length ? values.length : categories.length
  return categories.slice(0, lowerLength)
}

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
