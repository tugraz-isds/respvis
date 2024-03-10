import {getUnRestrainedSelectors, groundUnRestrainedSelectors} from "./adaptSelectors";

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
          //TODO: implement copying container rules!
          console.log(cssRule)
        } break
        case cssRule instanceof CSSStyleRule:
        case cssRule instanceof CSSPageRule: {
          const styleRule = getStyleRule(cssRule as CSSStyleRule | CSSPageRule)
          if (styleRule !== '') cssRules.add(styleRule)
        } break
        default:
      }
    }
    return cssRules
  }

  function getStyleRule(cssRule: CSSStyleRule | CSSPageRule) {
    const matchesSVGStandalone = targetClone.matches(cssRule.selectorText) || targetClone.querySelector(cssRule.selectorText)
    if (matchesSVGStandalone) {
      return cssRule.cssText
    }
    const matchesSVGInDOM = target.matches(cssRule.selectorText) || target.querySelector(cssRule.selectorText)
    if (matchesSVGInDOM) {
      const adaptedSelector = groundUnRestrainedSelectors(getUnRestrainedSelectors(targetClone, cssRule))
      return adaptedSelector.trim() + ' {' + cssRule.style.cssText + '}'
    }
    return ''
  }

  return cssRules
}
