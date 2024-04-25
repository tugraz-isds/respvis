export function getUnRestrainedSelectors(root: Element, cssStyleRule: CSSStyleRule | CSSPageRule) {
  const selectors = cssStyleRule.selectorText.split(',')
  return selectors.map(selector => {
    //concat at ampersand places
    const selectorParts = selector.trim().split(/\s+/);
    selectorParts[0] = selectorParts[0] === '&' ? selectorParts[0].substring(1) : selectorParts[0]

    for (let i = 0; i <= selectorParts.length - 1; i++) {
      const unRestrainedSelector = selectorParts.slice(i).join(' ')
      try {
        if (root.querySelector(unRestrainedSelector)) {
          return unRestrainedSelector;
        }
      } catch (e) {
        if (!(e instanceof DOMException)) throw e
      }
    }
    return ''
  }).filter(selector => selector !== '')
}

export function groundUnRestrainedSelectors(selectors: string[]) {
  return selectors.map(selector => '.chart ' + selector).join(',')
}
