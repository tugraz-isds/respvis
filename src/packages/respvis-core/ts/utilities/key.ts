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

  getSeries(): number | undefined {
    const matchIndex = this.rawKey.match(/\bs-(\d+)\b/)
    if (!matchIndex) return undefined
    return parseInt(matchIndex[1])
  }

  getSeriesCategory(): [number, number] | undefined {
    const matchIndex = this.rawKey.match(/\bs-(\d+)-c-(\d+)\b/)
    if (!matchIndex) return undefined
    return [parseInt(matchIndex[1]), parseInt(matchIndex[2])]
  }

  getAxisCategories() {
    const regex = /\ba-(\d+)-c-(\d+)\b/g;
    let matchIndex
    const pairs: [number, number][] = []
    while ((matchIndex = regex.exec(this.rawKey)) !== null) {
      pairs.push([parseInt(matchIndex[1]), parseInt(matchIndex[2])])
    }
    return pairs
  }
}
