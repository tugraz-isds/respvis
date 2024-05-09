import {getActiveCSSRulesForElement} from "./getActiveCSSRules";
import {Renderer} from "../../../../chart/renderer";
import {elementComputedStyleWithoutDefaults, elementSVGPresentationAttrs} from "../../../../../utilities/element";
import {ErrorMessages} from "../../../../../utilities/error";
import {
  cssContentFromEntries,
  getActiveCSSVars,
  getRelevantCSSVars
} from "respvis-core/render/toolbar/download-tool/chart-download/apply-download-style/get-active-CSSVars";
import {
  createCSSRule
} from "respvis-core/render/toolbar/download-tool/chart-download/apply-download-style/create-CSSRule";

export function applyDownloadStyle(original: SVGSVGElement, clone: SVGSVGElement, renderer: Renderer) {
  const { windowSettings } = renderer.windowS.datum()
  switch (windowSettings.downloadStyleType) {
    case "embedded": embedCSS(original, clone); break
    case "inline": attrsFromComputedStyle(clone, original); break
    default: {
      attrsFromComputedStyle(clone, original)
      /* DEV_MODE_ONLY_START */
      throw new Error(ErrorMessages.invalidScaledValuesCombination)
      /* DEV_MODE_ONLY_END */
    }
  }
}

function embedCSS(original: SVGSVGElement, clone: SVGSVGElement) {
  const activeCSSRules = Array.from<string>(getActiveCSSRulesForElement(original))
  const activeCSSVars = getActiveCSSVars(original)
  const relevantCSSVars = getRelevantCSSVars(activeCSSVars, [...activeCSSRules])
  const cssVarRule = createCSSRule('.chart', cssContentFromEntries(relevantCSSVars))
  const styleTag = document.createElement("style");
  [...activeCSSRules, cssVarRule].forEach((rule) => {
    const ruleXMLConform = rule.replace(/&/g, '&amp;')
    styleTag.appendChild(document.createTextNode(ruleXMLConform))
  })

  clone.appendChild(styleTag);
  copyInlineStyles(clone, original)
}

function copyInlineStyles(target: Element, source: Element) {
  const style = (source as SVGElement).style.cssText
  if (style) {
    (target as SVGElement).style.cssText = style
  }
  for (let i = 0; i < source.children.length; ++i) {
    copyInlineStyles(target.children[i], source.children[i]);
  }
}

function attrsFromComputedStyle(target: Element, source: Element) {
  const style = elementComputedStyleWithoutDefaults(source, elementSVGPresentationAttrs);
  for (let prop in style) {
    target.setAttribute(prop, style[prop]);
  }
  for (let i = 0; i < source.children.length; ++i) {
    attrsFromComputedStyle(target.children[i], source.children[i]);
  }
}
