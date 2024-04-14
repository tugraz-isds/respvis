import {SVGHTMLElement} from "../../../../../constants/types";

type CSSVarsEntries = Record<string, string>

export function getActiveCSSVars(element: SVGHTMLElement) {
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
  const [keys, values] = Object.entries(cssVars)
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
