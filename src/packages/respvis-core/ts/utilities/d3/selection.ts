import {BaseType, select, selectAll, Selection, Transition} from 'd3';
import {ErrorMessages} from "../../constants";

export type SelectionOrTransition<
  // provide default type parameters
  GElement extends BaseType = BaseType,
  Datum = unknown,
  PElement extends BaseType = BaseType,
  PDatum = unknown
> = Selection<GElement, Datum, PElement, PDatum> | Transition<GElement, Datum, PElement, PDatum>;

export function mapSelection<E extends BaseType, D>(selection: Selection<any, D>, mapper: (selection: Selection<any, D>) => Selection<E, D>) {
  let nodes: E[] = []
  selection.each((d, i, g) => {
    const mappingNode = mapper(select(g[i])).node()
    if (mappingNode) nodes.push(mappingNode)
  })
  return selectAll<E, D>(nodes)
}

export function applyClassList(selection: Selection, classList: string[], active: boolean) {
  classList.forEach(classToApply => selection.classed(classToApply, active))
  return selection
}

export function elementFromSelection<T extends BaseType>(selection?: Selection<T>): T {
  const element = selection?.node()
  if (!element) throw new Error(ErrorMessages.elementNotExisting)
  return element
}

export function cssVarFromSelection<T extends BaseType>(selection: Selection<T>, cssVar: string) {
  const element = selection?.node()
  if (!element || !(element instanceof Element)) return undefined
  return getComputedStyle(element).getPropertyValue(cssVar)
}

export function createSelectionClasses(classes: string[], leadingSpace = false) {
  const selector = classes.map(currentClass => '.' + currentClass).join('')
  const classString = classes.map(currentClass => ' ' + currentClass).join('')
  if (!leadingSpace) classString.trimStart()
  return {selector, classString}
}
