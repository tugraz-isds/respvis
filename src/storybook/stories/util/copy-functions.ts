export function copyFunctions<T extends object>(source: T, destination: T) {
  for (const key in source) {
    if (typeof source[key] === 'function') {
      destination[key] = source[key]
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      //@ts-ignore
      destination[key] = destination[key] || {}
      //@ts-ignore
      copyFunctions(source[key], destination[key])
    }
  }
}
