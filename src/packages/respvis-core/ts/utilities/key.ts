import {ActiveKeyMap} from "../constants/types";

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

export class Key {
  rawKey: string

  constructor(rawKey: string) {
    this.rawKey = rawKey
  }

  getIndex(): number | undefined {
    const matchIndex = this.rawKey.match(/\bi-(\d+)\b/)
    if (!matchIndex) return undefined
    return parseInt(matchIndex[1])
  }
}
