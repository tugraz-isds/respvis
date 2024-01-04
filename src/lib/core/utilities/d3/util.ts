import {ErrorMessages} from "../error";
import {BaseType, Selection} from "d3";

export function elementFromSelection<T extends BaseType>(selection?: Selection<T>): T {
  const element = selection?.node()
  if (!element) throw new Error(ErrorMessages.elementNotExisting)
  return element
}
