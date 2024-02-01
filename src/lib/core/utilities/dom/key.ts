import {categoryRegex, KeyType} from "../../constants/types";

export function splitKey(key: string) {
  return key.split(/[ ,]+/)
}

export function getSubKey(subkeys: string[], type: KeyType) {
  switch (type) {
    case "category": return subkeys.find(element => categoryRegex.test(element))
  }
  throw new Error("TODO: implement rest of function")
}
