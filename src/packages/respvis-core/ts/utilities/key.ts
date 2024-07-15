import {ActiveKeyMap, KeyPrefix} from "../constants/types";

export function splitKey(key: string) {
  return key.split(/[ ,]+/)
}

export function combineKeys(keys: (string | undefined)[]): string {
  return keys.reduce((prev, current) => {
    return prev + (current ? ' ' + current : '' )
  }, '')?.trimStart() as string
}

export function mergeKeys(keys: string[]) {
  return keys.reduce((prev, current) => {
    return prev + '-' + current
  })
}

export function getActiveKeys(keysActive: ActiveKeyMap) {
  return Object.keys(keysActive).filter((key) => keysActive[key])
}

export class Key<T extends string> {
  readonly prefix: T
  readonly index: number[]
  active: boolean

  constructor(prefix: T, index: number[], active?: boolean) {
    this.prefix = prefix
    this.index = index
    this.active = active ?? true
  }

  getRawKey(): string {
    return this.prefix + this.index.reduce((acc, value) => {
      return acc + '-' + value
    }, '')
  }
}


//composite key
export class CompositeKey {
  map: Record<KeyPrefix, Key<KeyPrefix> | undefined>

  constructor(keys: Key<KeyPrefix>[]) {
    this.map = this.assignKeys(keys)
  }

  assignKeys(keys: Key<KeyPrefix>[]) {
    this.map = this.map ?? {}
    keys.forEach(key => this.map[key.prefix] = key)
    return this.map
  }

  getRawKey() {
    return Object.values(this.map).reduce((acc, value) => {
      return acc + ((value !== undefined) ? value?.getRawKey() : '')
    }, '')
  }
}
