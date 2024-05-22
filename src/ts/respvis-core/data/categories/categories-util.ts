export function getCategoryOrderArray(categoryDim: string[]) {
  return categoryDim.reduce<string[]>(
    (prev, current) => prev.includes(current) ? prev : [...prev, current], [])
}

export type CategoryOrderMap = Record<string, number>

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
