import {getUnrestrainedSelectors, groundUnrestrainedSelectors} from "./adapt-selectors";

export function getActiveCSSRulesForElement(target: Element) {
  const cssRules = new Set<string>();
  const targetClone = target.cloneNode(true) as Element

  for (let i = 0; i < document.styleSheets.length; i++) {
    const styleSheet = document.styleSheets[i]
    if (!styleSheet.cssRules) continue
    getActiveCSSRules(styleSheet.cssRules).forEach(rule => cssRules.add(rule))
  }

  function getActiveCSSRules(rules: CSSRuleList) {
    const cssRules = new Set<string>()
    for (let i = 0; i < rules.length; i++) {
      const cssRule = rules[i]
      switch (true) {
        case cssRule instanceof CSSMediaRule: {
          if (window.matchMedia((cssRule as CSSMediaRule).media.mediaText).matches) {
            const activeMediaRules = getActiveCSSRules((cssRule as CSSMediaRule).cssRules)
            activeMediaRules.forEach(rule => cssRules.add(rule))
          }
        } break
        case cssRule instanceof CSSContainerRule: {
          //TODO: maybe replace this method as soon as there is global support for
          //      checking container queries like for CSSMediaRule
          const activeContainerRules = getActiveCSSRules((cssRule as CSSContainerRule).cssRules)
          activeContainerRules.forEach(rule => cssRules.add(rule))
        } break
        case cssRule instanceof CSSStyleRule:
        case cssRule instanceof CSSPageRule: {
          const styleRules = getStyleRules(cssRule as CSSStyleRule | CSSPageRule)
          styleRules.forEach(rule => cssRules.add(rule))
        } break
        default:
      }
    }
    return cssRules
  }

  function getWholeSelector(cssRule: CSSStyleRule | CSSPageRule) {
    const includeParentSelector = (cssRule.parentRule && (cssRule instanceof CSSStyleRule || cssRule instanceof CSSPageRule))
    return (includeParentSelector ? getWholeSelector(cssRule.parentRule as CSSStyleRule | CSSPageRule) : '') + ' ' + cssRule.selectorText
  }

  function getStyleRules(cssRule: CSSStyleRule | CSSPageRule) {
    const selectorText = getWholeSelector(cssRule).replace('&', '')
    const activeElementSVGStandalone = targetClone.matches(selectorText) ? targetClone : targetClone.querySelector(selectorText)
    if (activeElementSVGStandalone) {
      return new Set<string>().add(cssRule.cssText)
    }
    const activeElementInDOM = target.matches(selectorText) ? target : target.querySelector(selectorText)
    if (activeElementInDOM) {
      if (cssRule.parentRule instanceof CSSContainerRule && CSSRuleHasEffect(cssRule, activeElementInDOM as HTMLElement)) return new Set<string>()
      const adaptedSelector = groundUnrestrainedSelectors(getUnrestrainedSelectors(targetClone, cssRule))
      return new Set<string>().add(adaptedSelector.trim() + ' {' + cssRule.style.cssText + '}')
    }
    if (cssRule.cssRules && cssRule.cssRules.length > 0) {
      return getActiveCSSRules(cssRule.cssRules)
    }
    return new Set<string>()
  }

  function CSSRuleHasEffect(rule: CSSStyleRule | CSSPageRule, element: HTMLElement) {
    const beforeStyleComputed = window.getComputedStyle(element as Element)
    let beforeStyle = {}
    for (const prop in beforeStyleComputed) {
      beforeStyle[prop] = beforeStyleComputed[prop]
    }

    const styleElement = document.createElement('style')
    styleElement.appendChild(document.createTextNode(rule.cssText))
    document.head.appendChild(styleElement)
    const afterStyle = window.getComputedStyle(element)

    for (const prop in beforeStyle) {
      if (beforeStyle[prop] !== afterStyle[prop]) {
        document.head.removeChild(styleElement)
        return true;
      }
    }
    document.head.removeChild(styleElement)
    return false;
  }

  return cssRules
}
