import {SVGHTMLElementLegacy} from "../../../../../constants/types";

export type CSSVarsEntries = Record<string, string>

export function getActiveCSSVars(element: SVGHTMLElementLegacy) {
  const computedStyles = window.getComputedStyle(element);
  const cssVariables: CSSVarsEntries = {};

  for (let i = 0; i < computedStyles.length; i++) {
    const propertyName = computedStyles[i];
    if (!propertyName.startsWith('--')) continue
    cssVariables[propertyName] = computedStyles.getPropertyValue(propertyName).trim();
  }

  return cssVariables;
}

export function getRelevantCSSVars(cssVars: CSSVarsEntries, cssRules: string[]) {
  const entries = Object.entries(cssVars)
  const keys = entries.map(entry => entry[0])
  const values = entries.map(entry => entry[1])
  const relevantCSSVars: CSSVarsEntries = {}
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < cssRules.length; j++) {
      const cssVarKey = keys[i]
      const rule = cssRules[j]
      if (rule.includes(cssVarKey)) {
        relevantCSSVars[cssVarKey] = values[i]
        break
      }
    }
  }
  return relevantCSSVars
}

export function cssContentFromEntries(entries: CSSVarsEntries) {
  return Object.entries(entries).reduce((prev, [key, value]) => prev + `${key}: ${value};`, '')
}
