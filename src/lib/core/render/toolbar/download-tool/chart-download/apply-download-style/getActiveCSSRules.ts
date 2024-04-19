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
    const selectorText = getWholeSelector(cssRule)
    const activeElementSVGStandalone = targetClone.matches(selectorText) ? targetClone : targetClone.querySelector(selectorText)
    if (activeElementSVGStandalone) {
      return new Set<string>().add(cssRule.cssText)
    }
    const activeElementInDOM = target.matches(selectorText) ? target : target.querySelector(selectorText)
    if (activeElementInDOM) {
      if (cssRule.parentRule instanceof CSSContainerRule && CSSRuleHasEffect(cssRule, activeElementInDOM as HTMLElement)) return new Set<string>()
      const adaptedSelector = groundUnRestrainedSelectors(getUnRestrainedSelectors(targetClone, cssRule))
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



// This function was intended to check if Container Styles are currently active or not.
// However this is currently not so easy as with media queries.
// Instead function CSSRuleHasEffect was used to check if the addition of container queries
// to the document changes styles.

// function checkParentRuleActive(parentRule: CSSRule, currentParent: Element | null, target: Element) {
//   if (!currentParent) return false
//   if (!(parentRule instanceof CSSContainerRule)) {
//     '/* DEV_MODE_ONLY_START */'
//     console.log('CSSRule Parent checking not implemented!', parentRule)
//     '/* DEV_MODE_ONLY_END */'
//     return true
//   }
//
//   const containerType = window.getComputedStyle(currentParent).containerType
//   const containerName = window.getComputedStyle(currentParent).containerName
//
//   if (parentRule.containerName !== '' && parentRule.containerName !== containerType) {
//     return checkParentRuleActive(parentRule, target.parentElement, target)
//   }
//   if (containerType === 'size' || containerType === 'inline-size' || containerType === 'normal') {
//     parentRule.containerQuery.
//     //do comparison here
//     console.log(window.matchMedia(parentRule.containerQuery))
//     return true
//   }
//   return checkParentRuleActive(parentRule, target.parentElement, target)
// }
//
//
