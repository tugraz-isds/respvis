export function createCSSRule(selectorText: string, content: string) {
  return selectorText + ' {' + content + '}';
}
