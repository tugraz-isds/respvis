// source: https://stackoverflow.com/a/16436975
export function arrayEquals(a: any[] | null, b: any[] | null): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] instanceof Array && !arrayEquals(a[i], b[i])) return false;
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function arrayIs(array: any): array is any[] {
  return Array.isArray(array);
}

export function arrayIs2D(array: any): array is any[][] {
  return arrayIs(array) && array.every((e) => Array.isArray(e));
}

export function arrayPartition<T>(array: T[], size: number): T[][] {
  const partitions: T[][] = [];
  for (let i = 0; i < array.length; i += size) partitions.push(array.slice(i, i + size));
  return partitions;
}

export function arrayAlignLengths<T1, T2>(array1: T1, array2: T2): [T1, T2] {
  if (!Array.isArray(array1) || !Array.isArray(array2)) throw new Error('Wrong usage of array util!')
  const lowerLength = array1.length < array2.length ? array1.length : array2.length
  return [array1.slice(0, lowerLength) as T1, array2.slice(0, lowerLength) as T2]
}

export function sum(array: number[]) {
  return array.reduce((sum, val) => sum + val, 0)
}

export function arrayOrder(arr: number[]) {
  const arrOrder = arr.map(() => 1)
  for (let j = 0; j < arr.length; j++) {
    for (let i = j + 1; i < arr.length; i++) {
      if (arr[j] > arr[i]) arrOrder[j] = arrOrder[j] + 1
      else arrOrder[i] = arrOrder[i] + 1
    }
  }
  return arrOrder
}
