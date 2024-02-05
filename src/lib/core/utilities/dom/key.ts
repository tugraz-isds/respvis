import {ActiveKeyMap, categoryRegex, KeyType} from "../../constants/types";

export function splitKey(key: string) {
  return key.split(/[ ,]+/)
}

export function getSubKey(subkeys: string[], type: KeyType) {
  switch (type) {
    case "category": return subkeys.find(element => categoryRegex.test(element))
  }
  throw new Error("TODO: implement rest of function")
}

export function combineKeys(keys: (string | undefined)[]): string {
  return keys.reduce((prev, current) => {
    return prev + (current ? ' ' + current : '' )
  }, '') as string
}

export function mergekeys(keys: string[]) {
  return keys.reduce((prev, current) => {
    return prev + '-' + current
  })
}

export function getActiveKeys(keysActive: ActiveKeyMap) {
  return Object.keys(keysActive).filter((key) => keysActive[key])
}
