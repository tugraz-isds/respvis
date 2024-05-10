export function getParentClassesRelative(element: Element, untilClass: string) {
  const classLists: DOMTokenList[] = []
  let parent = element.parentElement
  while (parent && !parent.classList.contains(untilClass)) {
    classLists.push(parent.classList)
    parent = parent.parentElement
  }
  return classLists
}
