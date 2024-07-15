export namespace RVArray {
  export function equalizeLengths<T1, T2>(array1: T1, array2: T2): [T1, T2] {
    if (!Array.isArray(array1) || !Array.isArray(array2)) throw new Error('Wrong usage of array util!')
    const lowerLength = array1.length < array2.length ? array1.length : array2.length
    return [array1.slice(0, lowerLength) as T1, array2.slice(0, lowerLength) as T2]
  }

  export function sum(array: number[]) {
    return array.reduce((sum, val) => sum + val, 0)
  }

  export function mapToRanks(array: number[]) {
    const arrOrder = array.map(() => 1)
    for (let j = 0; j < array.length; j++) {
      for (let i = j + 1; i < array.length; i++) {
        if (array[j] > array[i]) arrOrder[j] = arrOrder[j] + 1
        else if (array[j] < array[i]) arrOrder[i] = arrOrder[i] + 1
      }
    }
    return arrOrder
  }

  export function clearDuplicatedValues<T>(array: T[]) {
    return array.reduce<T[]>(
      (prev, current) => prev.includes(current) ? prev : [...prev, current], [])
  }

  //src: https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
  export function groupBy<T extends Record<PropertyKey, any>,
    K extends keyof T>(array: T[], key:  K & (T[K] extends PropertyKey ? K : never)) {
    return array.reduce((acc, val) => {
      (acc[val[key]] = acc[val[key]] || []).push(val);
      return acc;
    }, {} as Record<T[K], T[]>);
  }

  export function isNumberArray(arr: any[]): arr is number[] {
    return arr.length > 0 && arr.every(el => typeof el === 'number')
  }

  export function isDateArray(arr: any[]): arr is Date[] {
    return arr.length > 0 && arr.every(el => el instanceof Date)

  }

  export function hasValueOf(arr: any[]): arr is { valueOf: () => number }[] {
    return arr.length > 0 && arr.every(el => typeof el.valueOf === "number")
  }

  export function isStringArray(arr: any[]): arr is string[] {
    return arr.length > 0 && arr.every(el => typeof el === 'string')
  }

  // export function arrayIs2D(array: any): array is any[][] {
//   return Array.isArray(array) && array.every((e) => Array.isArray(e));
// }
//
}
