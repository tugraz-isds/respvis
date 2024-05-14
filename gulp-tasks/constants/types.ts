type KeyObject<T extends readonly string[]> = {
  [K in T[number]]: K;
}

export function genKeyObject<T extends readonly string[]>(arr: T) {
  return arr.reduce((acc, item) => {
    acc[item] = item; return acc;
  }, {}) as KeyObject<T>
}
